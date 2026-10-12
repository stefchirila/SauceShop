/**
 * Header and burger menu. Present on every page after login, which is why these
 * selectors live here instead of being duplicated per page.
 */
export const headerLocators = {
  pageTitle: '[data-test="title"]',

  cartLink: '[data-test="shopping-cart-link"]',
  cartBadge: '[data-test="shopping-cart-badge"]',

  /**
   * The burger menu must be opened through the <button>, not through
   * [data-test="open-menu"]: that attribute sits on the inner <img>, and the
   * button above it intercepts pointer events.
   */
  burgerMenuButton: '#react-burger-menu-btn',
  closeMenuButton: '#react-burger-cross-btn',

  allItemsLink: '[data-test="inventory-sidebar-link"]',
  aboutLink: '[data-test="about-sidebar-link"]',
  logoutLink: '[data-test="logout-sidebar-link"]',
  resetAppStateLink: '[data-test="reset-sidebar-link"]',
};
