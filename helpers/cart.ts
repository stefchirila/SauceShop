import { Page, expect } from '@playwright/test';
import { cartLocators } from '../locators/cartPageLocators';
import {
  checkoutStepOneLocators,
  checkoutStepTwoLocators,
  checkoutCompleteLocators,
} from '../locators/checkoutPageLocators';
import { Strings } from '../utils/strings';
import { parseMoney } from '../utils/money';
import { TAX_RATE, roundMoney } from '../data/pricing';

/* ---------- cart page ---------- */

export async function expectProductInCart(page: Page, productName: string): Promise<void> {
  const product = page.locator(cartLocators.itemName, { hasText: productName });
  await expect(product).toBeVisible();
}

export async function expectCartRowCount(page: Page, expectedCount: number): Promise<void> {
  await expect(page.locator(cartLocators.cartItem)).toHaveCount(expectedCount);
}

export async function removeItemFromCart(page: Page, productName: string): Promise<void> {
  const removeButton = page.locator(cartLocators.removeFromCartButton(productName));

  await expect(removeButton).toBeVisible();
  await removeButton.click();
  await expect(page.locator(cartLocators.itemName, { hasText: productName })).toHaveCount(0);
}

export async function proceedToCheckout(page: Page): Promise<void> {
  const checkoutButton = page.locator(cartLocators.checkoutButton);

  await expect(checkoutButton).toBeVisible();
  await checkoutButton.click();
  await expect(page).toHaveURL(Strings.checkoutStepOne);
}

/* ---------- checkout step one ---------- */

interface CheckoutInfo {
  firstName?: string;
  lastName?: string;
  zipCode?: string;
}

/** Fills whichever fields are provided. Submitting is a separate step on purpose. */
export async function fillCheckoutInfo(page: Page, info: CheckoutInfo): Promise<void> {
  if (info.firstName !== undefined) {
    await page.locator(checkoutStepOneLocators.firstNameInput).fill(info.firstName);
  }

  if (info.lastName !== undefined) {
    await page.locator(checkoutStepOneLocators.lastNameInput).fill(info.lastName);
  }

  if (info.zipCode !== undefined) {
    await page.locator(checkoutStepOneLocators.zipCodeInput).fill(info.zipCode);
  }
}

export async function clickContinueButton(page: Page): Promise<void> {
  const continueButton = page.locator(checkoutStepOneLocators.continueButton);

  await expect(continueButton).toBeVisible();
  await continueButton.click();
}

export async function expectCheckoutError(page: Page, expectedText: string): Promise<void> {
  const error = page.locator(checkoutStepOneLocators.errorMessage);

  await expect(error).toBeVisible();
  await expect(error).toHaveText(expectedText);
}

/* ---------- checkout step two ---------- */

export async function expectProductInOrderSummary(
  page: Page,
  productName: string
): Promise<void> {
  await expect(page.locator(checkoutStepTwoLocators.itemName, { hasText: productName })).toBeVisible();
}

/**
 * Checks the money on the overview page against the line items rather than
 * against hardcoded figures: item total is the sum of the line prices, tax is
 * TAX_RATE of that total rounded to two decimals, and total is the two added up.
 */
export async function expectOrderTotals(page: Page, expectedItemCount: number): Promise<void> {
  const linePrices = page.locator(checkoutStepTwoLocators.itemPrice);
  await expect(linePrices).toHaveCount(expectedItemCount);
  await expect(page.locator(checkoutStepTwoLocators.totalLabel)).toContainText('Total: $');

  const sumOfLines = roundMoney(
    (await linePrices.allTextContents()).map(parseMoney).reduce((acc, price) => acc + price, 0)
  );

  const itemTotal = parseMoney(
    await page.locator(checkoutStepTwoLocators.subtotalLabel).innerText()
  );
  const tax = parseMoney(await page.locator(checkoutStepTwoLocators.taxLabel).innerText());
  const total = parseMoney(await page.locator(checkoutStepTwoLocators.totalLabel).innerText());

  expect(itemTotal, 'item total should equal the sum of the line prices').toBe(sumOfLines);
  expect(tax, `tax should be ${TAX_RATE * 100}% of the item total, rounded`).toBe(
    roundMoney(itemTotal * TAX_RATE)
  );
  expect(total, 'total should be item total plus tax').toBe(roundMoney(itemTotal + tax));
}

export async function placeOrder(page: Page): Promise<void> {
  await page.locator(checkoutStepTwoLocators.finishButton).click();
  await expect(page).toHaveURL(Strings.checkoutCompleted);
}

/* ---------- checkout complete ---------- */

export async function expectCompletePage(page: Page): Promise<void> {
  const message = page.locator(checkoutCompleteLocators.thankYouHeader);
  await expect(message).toBeVisible();
  await expect(message).toHaveText(Strings.thankYouMessage);

  const button = page.locator(checkoutCompleteLocators.backHomeButton);
  await expect(button).toBeVisible();
  await expect(button).toHaveText(Strings.backHomeButtonText);
}
