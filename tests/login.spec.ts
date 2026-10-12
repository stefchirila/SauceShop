import { login, logout, expectAuthGuardError } from '../helpers/auth';
import { test, expect } from '../fixtures';
import { Strings } from '../utils/strings';

test.describe('Authentication', () => {
  test('Login with standard user', async ({ page }) => {
    await login(page, 'standard');
  });

  test('Login with locked account', async ({ page }) => {
    await login(page, 'locked', {
      expectedError: Strings.lockedUserError,
    });
  });

  test('Login performance glitch user', async ({ page }) => {
    // This account answers deliberately slowly, so give it room on a loaded runner.
    test.slow();
    await login(page, 'performance');
  });

  test('Login with wrong password', async ({ page }) => {
    await login(page, 'standard', {
      password: 'wrong',
      expectedError: Strings.standardUserError,
    });
  });

  test('Login with wrong user name', async ({ page }) => {
    await login(page, 'wrongUser', {
      expectedError: Strings.standardUserError,
    });
  });
});

test.describe('Session', () => {
  test('Logout returns to the login page', async ({ page }) => {
    await login(page, 'standard');
    await logout(page);
  });

  test('Products page is not reachable after logout', async ({ page }) => {
    await login(page, 'standard');
    await logout(page);

    await page.goto(Strings.inventory);
    await expectAuthGuardError(page, Strings.inventoryGuardError);
  });

  test('Products page is not reachable without logging in', async ({ page }) => {
    await page.goto(Strings.inventory);
    await expectAuthGuardError(page, Strings.inventoryGuardError);
  });
});
