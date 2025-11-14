import { Page, expect } from '@playwright/test';
import { cartLocators, checkoutErrorLocators, checkoutLocators, CheckoutCompletedPage } from '../locators/cartPageLocators';

export async function expectProductInCart(page: Page, productName: string) {
  const productLocator = page.locator(cartLocators.cartItemName, { hasText: productName });
  await expect(productLocator).toBeVisible();
}

export async function removeItemFromCart(page: Page, productName: string) {
    const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButtonLocator = `[data-test="remove-${formattedName}"]`;
    const removeButton = page.locator(removeButtonLocator);

    await expect(removeButton).toBeVisible();
    await removeButton.click();
    await expect(page.locator(cartLocators.cartItemName, { hasText: productName })).toHaveCount(0);
}

export async function proceedToCheckout(page: Page) {
    const checkoutButton = page.locator(cartLocators.checkoutButton);
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();
}

export async function clickContinueButton(page: Page) {
    const continueButton = page.locator(cartLocators.continueCheckoutButton);
    await expect(continueButton).toBeVisible();
    await continueButton.click();
}

export async function expectCheckoutError(page: Page, expectedText: string) {
    const error = page.locator(checkoutErrorLocators.errorMessage);
    await expect(error).toBeVisible();
    await expect(error).toHaveText(new RegExp(expectedText, 'i'));
}

export async function fillFirstName(page: Page, firstName: string) {
    await page.locator(checkoutErrorLocators.firstNameInput).fill(firstName);
}

export async function fillLasttName(page: Page, lastName: string) {
    await page.locator(checkoutErrorLocators.lastNameInput).fill(lastName);
}

export async function fillZipCode(page: Page, ZipCode: string) {
    await page.locator(checkoutErrorLocators.zipCode).fill(ZipCode);
}

interface CheckoutInfo {
  firstName?: string;
  lastName?: string;
  zipCode?: string;
}

export async function fillCheckoutInfo(page: Page, info: CheckoutInfo) {
    if (info.firstName !== undefined) {
    await page.locator(checkoutErrorLocators.firstNameInput).fill(info.firstName);
}

    if (info.lastName !== undefined) {
    await page.locator(checkoutErrorLocators.lastNameInput).fill(info.lastName);
}

    if (info.zipCode !== undefined) {
    await page.locator(checkoutErrorLocators.zipCode).fill(info.zipCode);
}
    await page.locator(checkoutErrorLocators.continueButton).click();
}

export async function verifyProductAndPlaceOrder(page: Page, expectedProductName: string) {
    await expect(page.locator(checkoutLocators.productName)).toHaveText(expectedProductName);
    await page.locator(checkoutLocators.finishButton).click();
}

export const CheckoutCompleteHelper = {
    async verifyThankYouMessage(page: Page) {
    const message = page.locator(CheckoutCompletedPage.thankYouMessage);
    await expect(message).toBeVisible();
    await expect(message).toHaveText('Thank you for your order!');
  },

async verifyBackHomeButton(page: Page) {
    const button = page.locator(CheckoutCompletedPage.backHomeButton);
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Back Home');
  },

async verifyCompletePage(page: Page) {
    await this.verifyThankYouMessage(page);
    await this.verifyBackHomeButton(page);
  },
};

