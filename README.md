# proiect-saucedemo

End-to-end test suite for [saucedemo.com](https://www.saucedemo.com), built with **Playwright** and **TypeScript**.

It covers the authentication flows (standard user, locked-out account, performance glitch user, invalid credentials), session handling (logout and the authorization guard on protected pages), product sorting, shopping cart management, and the full checkout process including form validation and the price totals.

---

## Requirements

- **Node.js** 18 or newer (LTS recommended)
- **npm** (ships with Node)

Check what you have installed:

```bash
node -v
npm -v
```

## Setup

```bash
# 1. Install project dependencies
npm install

# 2. Install the browsers Playwright drives
npx playwright install chromium
```

The second step is required — Playwright downloads its own browser binaries, separate from the Chrome installed on your system. To get every browser (for when you enable Firefox/WebKit in the config), run `npx playwright install` with no argument.

No `.env` file or credentials are needed: the test accounts are public and live in `data/testAccountData.ts`.

## Commands

| Command | What it does |
|---|---|
| `npm test` | Run the whole suite (20 tests) |
| `npm run test:ui` | Open **UI mode** — interactive runner with timeline, watch mode and DOM snapshots |
| `npm run test:debug` | Step through tests with the Playwright Inspector |
| `npm run test:login` | Run the authentication tests only |
| `npm run test:cart` | Run the cart and checkout tests only |
| `npm run test:sort` | Run the product sorting tests only |
| `npm run report` | Open the HTML report from the last run |
| `npm run codegen` | Record browser actions and generate test code |

### Targeted runs

```bash
# a single file
npx playwright test tests/login.spec.ts

# a single test, by title
npx playwright test -g "Login with locked account"

# serially, one test at a time
npx playwright test --workers=1

# with the browser visible
npx playwright test --headed
```

There is no `--headless` flag: headless is the CLI default, and this project overrides
it to `false` in the config, so local runs are headed unless you change `headless` there.

## Project structure

```
tests/                        specs (what is verified)
  login.spec.ts                 authentication, logout, authorization guard
  addToCart.spec.ts             cart + checkout + order totals
  sortProducts.spec.ts          product sorting
helpers/                      reusable actions (how it is done)
  auth.ts                       login, logout, asserting success or an error
  products.ts                   add/remove, cart badge, sorting, list readers
  cart.ts                       cart, checkout form, totals, order placement
locators/                     selectors, one module per page
  headerLocators.ts             header and burger menu (shared by every page)
  loginPageLocators.ts          login form
  shopPageLocators.ts           products page and sort dropdown
  cartPageLocators.ts           cart page
  checkoutPageLocators.ts       checkout step one / step two / complete
data/
  testAccountData.ts            test accounts and password
  pricing.ts                    tax rate and money rounding
utils/
  strings.ts                    expected texts, URLs, product names, sort values
  money.ts                      parses amounts out of labels like 'Tax: $2.40'
fixtures.ts                   fixture that lands every test on baseURL
playwright.config.ts          configuration
```

The guiding idea: **specs describe the scenario, helpers perform the actions, locators know the selectors.** When the application UI changes you only touch `locators/`; when a flow changes you only touch `helpers/`.

### Conventions

Assertions use *web-first assertions* (`expect(locator).toHaveText(...)`), which are retried automatically until timeout — no `waitForTimeout`, and no comparisons against values read a single time.

Each action helper performs its action **and waits for the effect to land in the DOM**, so callers never race a re-render. `addToCart` waits for the Remove button to appear, `removeFromCart` for the Add button to come back. Business assertions stay in the specs.

Where a list is read as data rather than asserted directly — the sorting tests — the read is gated behind a web-first assertion first, because the row count does not change when the order does and therefore cannot serve as a wait.

Order totals are checked against the line items, not against hardcoded figures: the item total must equal the sum of the line prices, tax must be `TAX_RATE` of that total rounded to two decimals, and the total must be the two added together. `TAX_RATE` lives in `data/pricing.ts`.

## Configuration

Everything is tuned from `playwright.config.ts`:

| Option | Current value | Notes |
|---|---|---|
| `baseURL` | `https://www.saucedemo.com` | lets tests use relative URLs |
| `headless` | `false` | browser visible locally; set `true` for faster runs |
| `fullyParallel` | `false` | tests inside the same file run sequentially |
| `workers` | `1` on CI, automatic locally | set to `1` outright for zero parallelism |
| `trace` | `on-first-retry` | locally there are no retries, so no trace is saved |
| `projects` | `chromium` only | Firefox and WebKit are commented out and can be enabled |

### Reports and traces

After a run, the HTML report is generated in `playwright-report/`:

```bash
npm run report
```

To investigate a failing test step by step, set `trace: 'retain-on-failure'` in the config, then open the trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Test accounts

All of them use the password `secret_sauce`, defined in `data/testAccountData.ts`:

| Key | Username | Behaviour |
|---|---|---|
| `standard` | `standard_user` | works normally |
| `locked` | `locked_out_user` | returns a locked-out error |
| `problem` | `problem_user` | intentional UI bugs |
| `performance` | `performance_glitch_user` | slow responses |
| `error` | `error_user` | fails on certain actions |
| `visual` | `visual_user` | visual differences |
| `wrongUser` | `wrong_user` | does not exist, used for the negative test |

Usage in a test:

```ts
await login(page, 'standard');

await login(page, 'locked', {
  expectedError: Strings.lockedUserError,
});
```

When `expectedError` is omitted, the helper itself verifies that login succeeded and that the inventory page was reached.
