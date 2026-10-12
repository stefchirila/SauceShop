import { shopLocators } from './shopPageLocators';

/** Cart page only (/cart.html). Checkout lives in checkoutPageLocators. */
export const cartLocators = {
  cartList: '[data-test="cart-list"]',
  cartItem: '[data-test="inventory-item"]',
  itemName: '[data-test="inventory-item-name"]',
  itemDesc: '[data-test="inventory-item-desc"]',
  itemPrice: '[data-test="inventory-item-price"]',
  itemQuantity: '[data-test="item-quantity"]',

  /** The remove button is the same element on the products page and in the cart. */
  removeFromCartButton: shopLocators.removeFromCartButton,

  continueShoppingButton: '[data-test="continue-shopping"]',
  checkoutButton: '[data-test="checkout"]',
};
