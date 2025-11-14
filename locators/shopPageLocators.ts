export const shopLocators = {
  addToCartButton: (productName: string) => {
  const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
  return `[data-test="add-to-cart-${formattedName}"]`;
  },

  removeFromCartButton: (productName: string) => {
  const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
  return `[data-test="remove-${formattedName}"]`;
  },
  cartLink: '[data-test="shopping-cart-link"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
};