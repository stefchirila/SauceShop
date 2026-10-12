import { Page, expect } from '@playwright/test';
import { shopLocators } from '../locators/shopPageLocators';

export async function addToCart(page: Page, productName: string) {
    await page.locator(shopLocators.addToCartButton(productName)).click();

};

export async function removeFromCart(page: Page, productName: string) {
  await page.locator(shopLocators.removeFromCartButton(productName)).click();
};

export async function expectCartItemCount(page: Page, expectedCount: number) {
    const badge = page.locator(shopLocators.cartBadge);

    if (expectedCount === 0) {
    // Badge-ul este scos din DOM cand coșul este gol.
    await expect(badge).toHaveCount(0);
  } else {
    await expect(badge).toHaveText(String(expectedCount));
  }
};

export async function goToCart(page: Page) {
    await page.locator(shopLocators.cartLink).click();
};