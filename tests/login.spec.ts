import { login } from '../helpers/auth';
import { test, expect } from '../fixtures';
import { Strings } from '../utils/strings';

test('Login with standard user', async ({ page }) => {
  await login(page, 'standard');
  await expect(page).toHaveURL(Strings.inventory);
});

test('Login with locked account', async ({ page }) => {
  await login(page, 'locked', {
    expectedError: Strings.lockedUserError
  });
});

test('Login performance glitch user', async ({ page }) => {
  await login(page, 'performance');
  await expect(page).toHaveURL(Strings.inventory);
});

test('Login with wrong password', async ({ page }) => {
  await login(page, 'standard'), {
    PASSWORD: "wrong",
    expectedError: Strings.standardUserError
  };
});

test('Login with wrong user name', async ({ page }) => {
  await login(page, 'wrongUser'), {
    PASSWORD: "wrong",
    expectedError: Strings.standardUserError
  };
});