import { test as base, Page } from '@playwright/test';

export const test = base.extend<{
  pageOnBase: Page;
}>({
  page: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },
});

export { expect } from '@playwright/test';
