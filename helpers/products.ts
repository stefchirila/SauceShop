import { Page, expect } from '@playwright/test';
import { shopLocators } from '../locators/shopPageLocators';
import { headerLocators } from '../locators/headerLocators';
import { Strings, type SortOptionValue } from '../utils/strings';
import { parseMoney } from '../utils/money';

/** The catalogue is fixed, so the list length doubles as a render gate. */
export const PRODUCT_COUNT = 6;

/**
 * Contract for the action helpers below: each performs the action and waits for
 * its effect to land in the DOM, so callers never race the re-render. Business
 * assertions stay in the specs.
 */

export async function addToCart(page: Page, productName: string): Promise<void> {
  await page.locator(shopLocators.addToCartButton(productName)).click();
  await expect(page.locator(shopLocators.removeFromCartButton(productName))).toBeVisible();
}

export async function removeFromCart(page: Page, productName: string): Promise<void> {
  await page.locator(shopLocators.removeFromCartButton(productName)).click();
  await expect(page.locator(shopLocators.addToCartButton(productName))).toBeVisible();
}

export async function expectCartItemCount(page: Page, expectedCount: number): Promise<void> {
  const badge = page.locator(headerLocators.cartBadge);

  if (expectedCount === 0) {
    // The badge is removed from the DOM when the cart is empty.
    await expect(badge).toHaveCount(0);
  } else {
    await expect(badge).toHaveText(String(expectedCount));
  }
}

export async function goToCart(page: Page): Promise<void> {
  await page.locator(headerLocators.cartLink).click();
  await expect(page).toHaveURL(Strings.cart);
}

export async function sortBy(page: Page, option: SortOptionValue): Promise<void> {
  const dropdown = page.locator(shopLocators.sortDropdown);
  await dropdown.selectOption(option);
  await expect(dropdown).toHaveValue(option);
}

/**
 * Gates on the re-render after a sort. Reading the list straight after sortBy
 * would race it: the row count never changes, so it cannot be used as a wait.
 */
export async function expectFirstProductName(page: Page, expectedName: string): Promise<void> {
  await expect(page.locator(shopLocators.itemName).first()).toHaveText(expectedName);
}

export async function expectFirstProductPrice(page: Page, expectedPrice: string): Promise<void> {
  await expect(page.locator(shopLocators.itemPrice).first()).toHaveText(expectedPrice);
}

/** Product names in display order, read once the whole list has rendered. */
export async function getProductNames(page: Page): Promise<string[]> {
  const names = page.locator(shopLocators.itemName);
  await expect(names).toHaveCount(PRODUCT_COUNT);
  return names.allTextContents();
}

/** Product prices in display order, as numbers. */
export async function getProductPrices(page: Page): Promise<number[]> {
  const prices = page.locator(shopLocators.itemPrice);
  await expect(prices).toHaveCount(PRODUCT_COUNT);
  return (await prices.allTextContents()).map(parseMoney);
}
