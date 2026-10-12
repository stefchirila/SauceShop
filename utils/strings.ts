export const Strings = {
    // Login
    homePageTitle: 'Swag Labs',
    lockedUserError: 'Epic sadface: Sorry, this user has been locked out.',
    standardUserError: 'Epic sadface: Username and password do not match any user in this service',

    // Products
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light',
    boltTShirt: 'Sauce Labs Bolt T-Shirt',
    jacket: 'Sauce Labs Fleece Jacket',
    onesie: 'Sauce Labs Onesie',
    redTShirt: 'Test.allTheThings() T-Shirt (Red)',

    // Catalogue extremes, used to gate the re-render after sorting
    lowestPrice: '$7.99',
    highestPrice: '$49.99',

    // Pages
    inventory: '/inventory.html',
    cart: '/cart.html',
    checkoutStepOne: '/checkout-step-one.html',
    checkoutStepTwo: '/checkout-step-two.html',
    checkoutCompleted: '/checkout-complete.html',

    // Page titles (the [data-test="title"] header)
    productsTitle: 'Products',
    cartTitle: 'Your Cart',
    checkoutStepOneTitle: 'Checkout: Your Information',
    checkoutStepTwoTitle: 'Checkout: Overview',
    checkoutCompleteTitle: 'Checkout: Complete!',

    // Checkout form errors
    firstNameErr: 'Error: First Name is required',
    lastNameErr: 'Error: Last Name is required',
    zipCodeErr: 'Error: Postal Code is required',

    // Checkout complete
    thankYouMessage: 'Thank you for your order!',
    backHomeButtonText: 'Back Home',

    // Authorization
    inventoryGuardError:
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
};

/** Values of the sort dropdown on the products page. */
export const SortOption = {
    nameAsc: 'az',
    nameDesc: 'za',
    priceAsc: 'lohi',
    priceDesc: 'hilo',
} as const;

export type SortOptionValue = (typeof SortOption)[keyof typeof SortOption];
