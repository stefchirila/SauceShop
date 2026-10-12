/**
 * Pulls the amount out of the texts the application renders, which mix labels
 * and currency: '$29.99', 'Item total: $29.99', 'Tax: $2.40'.
 */
export const parseMoney = (text: string): number => {
  const match = text.match(/-?\d+(?:\.\d+)?/);

  if (!match) {
    throw new Error(`No amount found in ${JSON.stringify(text)}`);
  }

  return Number(match[0]);
};
