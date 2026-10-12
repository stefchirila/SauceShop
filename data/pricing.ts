/**
 * Sales tax applied on the checkout overview page.
 * Verified against the live site: tax is the item total times this rate,
 * rounded (not truncated) to two decimals.
 */
export const TAX_RATE = 0.08;

/** Rounds to two decimals the same way the application does. */
export const roundMoney = (value: number): number => Number(value.toFixed(2));
