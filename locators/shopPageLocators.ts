/** 'Sauce Labs Backpack' -> 'sauce-labs-backpack', forma folosita in atributele data-test. */
export const productSlug = (productName: string): string =>
  productName.toLowerCase().replace(/\s+/g, '-');

export const shopLocators = {
  addToCartButton: (productName: string) =>
    `[data-test="add-to-cart-${productSlug(productName)}"]`,

  removeFromCartButton: (productName: string) =>
    `[data-test="remove-${productSlug(productName)}"]`,

  cartLink: '[data-test="shopping-cart-link"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
};