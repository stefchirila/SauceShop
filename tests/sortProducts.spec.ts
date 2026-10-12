import { login } from '../helpers/auth';
import { test, expect } from '../fixtures';
import { Strings, SortOption } from '../utils/strings';
import * as Product from '../helpers/products';

const byName = (a: string, b: string) => a.localeCompare(b);

test.describe('Sorting', () => {
  test('Products are sorted by name A to Z by default', async ({ page }) => {
    await login(page, 'standard');
    await Product.expectFirstProductName(page, Strings.backpack);

    const names = await Product.getProductNames(page);
    expect(names).toEqual([...names].sort(byName));
  });

  test('Name (Z to A) reverses the order', async ({ page }) => {
    await login(page, 'standard');

    await Product.sortBy(page, SortOption.nameDesc);
    await Product.expectFirstProductName(page, Strings.redTShirt);

    const names = await Product.getProductNames(page);
    expect(names).toEqual([...names].sort(byName).reverse());
  });

  test('Price (low to high) sorts ascending', async ({ page }) => {
    await login(page, 'standard');

    await Product.sortBy(page, SortOption.priceAsc);
    await Product.expectFirstProductPrice(page, Strings.lowestPrice);

    const prices = await Product.getProductPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('Price (high to low) sorts descending', async ({ page }) => {
    await login(page, 'standard');

    await Product.sortBy(page, SortOption.priceDesc);
    await Product.expectFirstProductPrice(page, Strings.highestPrice);

    const prices = await Product.getProductPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('Switching sort order actually changes the list', async ({ page }) => {
    await login(page, 'standard');
    await Product.expectFirstProductName(page, Strings.backpack);
    const ascending = await Product.getProductNames(page);

    await Product.sortBy(page, SortOption.nameDesc);
    await Product.expectFirstProductName(page, Strings.redTShirt);
    const descending = await Product.getProductNames(page);

    expect(descending).not.toEqual(ascending);
    expect(descending).toEqual([...ascending].reverse());
  });
});
