import { Page, expect } from '@playwright/test';
import { testAccounts, PASSWORD, type UserType } from '../data/testAccountData';
import { loginPageLocators } from '../locators/loginPageLocators';
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
  }
}