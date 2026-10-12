/** 'Sauce Labs Backpack' -> 'sauce-labs-backpack', the form used in data-test attributes. */
export const productSlug = (productName: string): string =>
  productName.toLowerCase().replace(/\s+/g, '-');

/** Products (inventory) page. Header and cart badge live in headerLocators. */
export const shopLocators = {
  addToCartButton: (productName: string) =>
    `[data-test="add-to-cart-${productSlug(productName)}"]`,

  removeFromCartButton: (productName: string) =>
    `[data-test="remove-${productSlug(productName)}"]`,

  inventoryList: '[data-test="inventory-list"]',
  inventoryItem: '[data-test="inventory-item"]',
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',

  sortDropdown: '[data-test="product-sort-container"]',
};
