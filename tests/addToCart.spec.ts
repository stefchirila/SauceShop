import { login } from '../helpers/auth';
import { test, expect } from '../fixtures';
import { Strings } from '../utils/strings';
import * as Product from '../helpers/products';
import * as Cart from '../helpers/cart';

const CHECKOUT_INFO = {
  firstName: 'Stefan',
  lastName: 'Chirila',
  zipCode: '700256',
};

test.describe('Cart', () => {
  /**
   * The remove button exists both on the products page and inside the cart.
   * Same scenario, two entry points.
   */
  for (const removeFrom of ['products page', 'cart page'] as const) {
    test(`Remove one of two products from the ${removeFrom}`, async ({ page }) => {
      await login(page, 'standard');
      await Product.expectCartItemCount(page, 0);

      await Product.addToCart(page, Strings.backpack);
      await Product.expectCartItemCount(page, 1);

      await Product.addToCart(page, Strings.jacket);
      await Product.expectCartItemCount(page, 2);

      if (removeFrom === 'products page') {
        await Product.removeFromCart(page, Strings.backpack);
        await Product.expectCartItemCount(page, 1);
        await Product.goToCart(page);
      } else {
        await Product.goToCart(page);
        await Cart.expectCartRowCount(page, 2);
        await Cart.removeItemFromCart(page, Strings.backpack);
      }

      await Product.expectCartItemCount(page, 1);
      await Cart.expectCartRowCount(page, 1);
      await Cart.expectProductInCart(page, Strings.jacket);
    });
  }
});

test.describe('Checkout', () => {
  test('Each required field is reported in turn', async ({ page }) => {
    await login(page, 'standard');
    await Product.addToCart(page, Strings.backpack);
    await Product.addToCart(page, Strings.jacket);
    await Product.expectCartItemCount(page, 2);

    await Product.goToCart(page);
    await Cart.proceedToCheckout(page);

    await test.step('first name is required', async () => {
      await Cart.clickContinueButton(page);
      await Cart.expectCheckoutError(page, Strings.firstNameErr);
    });

    await test.step('last name is required', async () => {
      await Cart.fillCheckoutInfo(page, { firstName: CHECKOUT_INFO.firstName });
      await Cart.clickContinueButton(page);
      await Cart.expectCheckoutError(page, Strings.lastNameErr);
    });

    await test.step('postal code is required', async () => {
      await Cart.fillCheckoutInfo(page, { lastName: CHECKOUT_INFO.lastName });
      await Cart.clickContinueButton(page);
      await Cart.expectCheckoutError(page, Strings.zipCodeErr);
    });

    await test.step('a complete form moves on to the overview', async () => {
      await Cart.fillCheckoutInfo(page, { zipCode: CHECKOUT_INFO.zipCode });
      await Cart.clickContinueButton(page);
      await expect(page).toHaveURL(Strings.checkoutStepTwo);
    });
  });

  test('Place order happy flow', async ({ page }) => {
    await login(page, 'standard');
    await Product.addToCart(page, Strings.backpack);

    await Product.goToCart(page);
    await Cart.proceedToCheckout(page);

    await Cart.fillCheckoutInfo(page, CHECKOUT_INFO);
    await Cart.clickContinueButton(page);
    await expect(page).toHaveURL(Strings.checkoutStepTwo);

    await Cart.expectProductInOrderSummary(page, Strings.backpack);
    await Cart.placeOrder(page);

    await Cart.expectCompletePage(page);
  });

  /** Item total, tax and total are the only real business logic in the app. */
  for (const products of [
    [Strings.backpack],
    [Strings.backpack, Strings.jacket],
    [Strings.onesie, Strings.bikeLight, Strings.redTShirt],
  ]) {
    test(`Order totals add up for ${products.length} product(s)`, async ({ page }) => {
      await login(page, 'standard');

      for (const product of products) {
        await Product.addToCart(page, product);
      }
      await Product.expectCartItemCount(page, products.length);

      await Product.goToCart(page);
      await Cart.proceedToCheckout(page);
      await Cart.fillCheckoutInfo(page, CHECKOUT_INFO);
      await Cart.clickContinueButton(page);
      await expect(page).toHaveURL(Strings.checkoutStepTwo);

      await Cart.expectOrderTotals(page, products.length);
    });
  }
});
