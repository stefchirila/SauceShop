import { Page, expect } from '@playwright/test';
import { testAccounts, PASSWORD, type UserType } from '../data/testAccountData';
import { loginPageLocators } from '../locators/loginPageLocators';
import { headerLocators } from '../locators/headerLocators';
import { shopLocators } from '../locators/shopPageLocators';
import { Strings } from '../utils/strings';

interface LoginOptions {
  password?: string;
  expectedError?: string;
}

export async function login(
  page: Page,
  userType: UserType,
  options: LoginOptions = {}
): Promise<void> {
  const username = testAccounts[userType];
  if (!username) {
    throw new Error(`Unknown user type: ${String(userType)}`);
  }

  const password = options.password ?? PASSWORD;

  await expect(page).toHaveTitle(Strings.homePageTitle);

  await page.locator(loginPageLocators.username).fill(username);
  await page.locator(loginPageLocators.passwd).fill(password);
  await page.locator(loginPageLocators.loginBtn).click();

  if (options.expectedError) {
    const error = page.locator(loginPageLocators.errorMessage);
    await expect(error).toBeVisible();
    await expect(error).toHaveText(options.expectedError);
  } else {
    await expect(page).toHaveURL(Strings.inventory);
  }
}

/** Opens the burger menu and logs out, then waits for the login page to come back. */
export async function logout(page: Page): Promise<void> {
  await page.locator(headerLocators.burgerMenuButton).click();

  const logoutLink = page.locator(headerLocators.logoutLink);
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();

  await expectLoggedOut(page);
}

export async function expectLoggedOut(page: Page): Promise<void> {
  await expect(page).toHaveURL('/');
  await expect(page.locator(loginPageLocators.loginBtn)).toBeVisible();
}

/**
 * Opening a protected page without a session redirects back to the login page
 * and renders the reason above the form. The redirect is client-side, so the
 * URL assertion has to be web-first — reading location straight after goto
 * still shows the requested path.
 *
 * Verified to behave the same for a fresh browser and one that just logged out.
 */
export async function expectAuthGuardError(page: Page, expectedError: string): Promise<void> {
  await expect(page).toHaveURL('/');

  const error = page.locator(loginPageLocators.errorMessage);
  await expect(error).toBeVisible();
  await expect(error).toHaveText(expectedError);

  await expect(page.locator(shopLocators.inventoryList)).toHaveCount(0);
}
