/** Checkout step one — the customer information form (/checkout-step-one.html). */
export const checkoutStepOneLocators = {
  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  zipCodeInput: '[data-test="postalCode"]',

  /** Note: this is an <input type="submit">, not a <button>. */
  continueButton: '[data-test="continue"]',
  cancelButton: '[data-test="cancel"]',

  errorMessage: '[data-test="error"]',
  errorCloseButton: '[data-test="error-button"]',
};

/** Checkout step two — the order summary with price totals (/checkout-step-two.html). */
export const checkoutStepTwoLocators = {
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',
  itemQuantity: '[data-test="item-quantity"]',

  paymentInfoValue: '[data-test="payment-info-value"]',
  shippingInfoValue: '[data-test="shipping-info-value"]',

  subtotalLabel: '[data-test="subtotal-label"]',
  taxLabel: '[data-test="tax-label"]',
  totalLabel: '[data-test="total-label"]',

  finishButton: '[data-test="finish"]',
  cancelButton: '[data-test="cancel"]',
};

/** Checkout complete — the confirmation page (/checkout-complete.html). */
export const checkoutCompleteLocators = {
  thankYouHeader: '[data-test="complete-header"]',
  completeText: '[data-test="complete-text"]',
  backHomeButton: '[data-test="back-to-products"]',
};
