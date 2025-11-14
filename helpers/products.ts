import { Page } from '@playwright/test';
import { shopLocators } from '../locators/shopPageLocators';

export async function addToCart(page: Page, productName: string) {
    await page.locator(shopLocators.addToCartButton(productName)).click();

};

export async function removeFromCart(page: Page, productName: string) {
  await page.locator(shopLocators.removeFromCartButton(productName)).click();
};

export async function getCartItemCount(page: Page): Promise<number> {
    const badge = page.locator(shopLocators.cartBadge);
    if (await badge.count() === 0) return 0;
    const text = await badge.textContent();
    return Number(text);
};

export async function expectCartItemCount(page: Page, expectedCount: number) {
    const count = await getCartItemCount(page);
    if (count !== expectedCount) {
    throw new Error(`Expected cart to have ${expectedCount} items, but got ${count}`);
  }
};

export async function goToCart(page: Page) {
    await page.locator(shopLocators.cartLink).click();
};