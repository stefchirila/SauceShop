import { login } from '../helpers/auth';
import { test } from '../fixtures';
import { Strings } from '../utils/strings';

test('Login with standard user', async ({ page }) => {
  await login(page, 'standard');
});

test('Login with locked account', async ({ page }) => {
  await login(page, 'locked', {
    expectedError: Strings.lockedUserError
  });
});

test('Login performance glitch user', async ({ page }) => {
  await login(page, 'performance');
});

test('Login with wrong password', async ({ page }) => {
  await login(page, 'standard', {
    password: 'wrong',
    expectedError: Strings.standardUserError
  });
});

test('Login with wrong user name', async ({ page }) => {
  await login(page, 'wrongUser', {
    expectedError: Strings.standardUserError
  });
});