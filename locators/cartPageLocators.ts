import { shopLocators } from './shopPageLocators';

export const cartLocators = {

  // items
  cartList: '[data-test="cart-list"]',
  cartItem: '[data-test="inventory-item"]',
  cartItemName: '[data-test="inventory-item-name"]',
  cartItemDesc: '[data-test="inventory-item-desc"]',
  cartItemPrice: '[data-test="inventory-item-price"]',
  cartItemQuantity: '[data-test="item-quantity"]',
  
  // Butonul de remove este acelasi element si pe pagina de produse, si in cos.
  removeFromCartButton: shopLocators.removeFromCartButton,

  continueShoppingButton: '[data-test="continue-shopping"]',

  checkoutButton: '[data-test="checkout"]',
  continueCheckoutButton: '[data-test="continue"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
  cartLink: '[data-test="shopping-cart-link"]',
};

export const checkoutErrorLocators = {
  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  zipCode: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',

  errorIcon: '.error_icon',
  errorContainer: '.error-message-container.error',
  errorMessage: '[data-test="error"]',
  errorCloseButton: '[data-test="error-button"]',
};

export const checkoutLocators = {
    productName: '[data-test="inventory-item-name"]',
    finishButton: '[data-test="finish"]',
}

export const CheckoutCompletedPage = {
    thankYouMessage: '[data-test="complete-header"]',
    backHomeButton: '[data-test="back-to-products"]',
  }