import { login } from '../helpers/auth';
import { test, expect } from '../fixtures';
import { Strings } from '../utils/strings';
import * as Product from '../helpers/products';
import * as Cart from '../helpers/cart';
import { expectCheckoutError } from '../helpers/cart';

test('Login with standard user and add or remove product from cart', async ({ page }) => {
    await login(page, 'standard');
    await Product.expectCartItemCount(page, 0);

    await Product.addToCart(page, Strings.backpack);
    await Product.expectCartItemCount(page, 1);

    await Product.addToCart(page, Strings.jacket);
    await Product.expectCartItemCount(page, 2);

    await Product.removeFromCart(page, Strings.backpack);
    await Product.expectCartItemCount(page, 1);

    await Product.goToCart(page);
    await Product.expectCartItemCount(page, 1);
    
    await Cart.expectProductInCart(page, Strings.jacket);
});

test('Login add product to cart from product list and remove from cart', async ({ page }) => {
    await login(page, 'standard');
    await Product.expectCartItemCount(page, 0);

    await Product.addToCart(page, Strings.backpack);
    await Product.expectCartItemCount(page, 1);

    await Product.addToCart(page, Strings.jacket);
    await Product.expectCartItemCount(page, 2);

    await Product.goToCart(page);
    await Product.expectCartItemCount(page, 2);

    await Cart.removeItemFromCart(page, Strings.backpack);
    await Product.expectCartItemCount(page, 1);
    await Cart.expectProductInCart(page, Strings.jacket);
});

test('Check errors for checkout flow', async ({ page }) => {
    await login(page, 'standard');
    await Product.addToCart(page, Strings.backpack);
    await Product.addToCart(page, Strings.jacket);
    await Product.expectCartItemCount(page, 2);

    await Product.goToCart(page);
    await Cart.proceedToCheckout(page);
    await expect(page).toHaveURL(Strings.checkoutStepOne);

    await Cart.clickContinueButton(page);
    await expectCheckoutError(page, Strings.firstNameErr);

    await Cart.fillFirstName(page, 'Stefan');
    await Cart.clickContinueButton(page);
    await expectCheckoutError(page, Strings.lastNameErr);

    await Cart.fillLasttName(page, 'Chirila');
    await Cart.clickContinueButton(page);
    await expectCheckoutError(page, Strings.zipCodeErr);

    await Cart.fillZipCode(page, '700256');
    await Cart.clickContinueButton(page);

    await expect(page).toHaveURL(Strings.checkoutStepTwo);
});

test('Place order happy flow', async ({ page }) => {
    await login(page, 'standard');
    await Product.addToCart(page, Strings.backpack);

    await Product.goToCart(page);
    await Cart.proceedToCheckout(page);
    await expect(page).toHaveURL(Strings.checkoutStepOne);

    await Cart.fillCheckoutInfo(page, {
    firstName: 'Stefan',
    lastName: 'Chirila',
    zipCode: '700256'
  });

  await expect(page).toHaveURL(Strings.checkoutStepTwo);

  await Cart.verifyProductAndPlaceOrder(page, Strings.backpack);

  await Cart.CheckoutCompleteHelper.verifyCompletePage(page);
  await expect(page).toHaveURL(Strings.checkoutCompleted);
});

