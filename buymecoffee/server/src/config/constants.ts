export const MIN_COFFEE_PRICE = 20;
export const MAX_COFFEE_PRICE = 500;
export const DEFAULT_COFFEE_PRICE = 100;

export const MIN_COFFEE_QUANTITY = 1;
export const MAX_COFFEE_QUANTITY = 5;

/**
 * Ensures coffeePrice is a valid whole INR number between MIN_COFFEE_PRICE and MAX_COFFEE_PRICE.
 * Gracefully normalizes any legacy paise amounts (e.g. 2000 -> 20, 50000 -> 500) and clamps/defaults invalid values.
 */
export function getValidCoffeePrice(rawPrice: unknown): number {
  if (typeof rawPrice !== "number" || !Number.isFinite(rawPrice)) {
    return DEFAULT_COFFEE_PRICE;
  }

  // Handle any legacy values stored in paise (e.g., 2000 to 50000)
  if (rawPrice >= 2000 && rawPrice <= 50000 && rawPrice % 100 === 0) {
    return rawPrice / 100;
  }

  // Guard against any value outside the 20 to 500 range
  if (rawPrice < MIN_COFFEE_PRICE || rawPrice > MAX_COFFEE_PRICE) {
    return DEFAULT_COFFEE_PRICE;
  }

  return Math.round(rawPrice);
}
