import { DiscountStrategy } from "./discount.strategy";

export class YearlyDiscountStrategy implements DiscountStrategy {
    private static readonly MONTHS_YEAR = 12;

    applyDiscount(monthlyCost: number, discountPercentaje: number): number {
        const yearlyCost = monthlyCost * YearlyDiscountStrategy.MONTHS_YEAR;
        const discountedYearlyCost = yearlyCost * (1 - discountPercentaje);
        return discountedYearlyCost / YearlyDiscountStrategy.MONTHS_YEAR;
    }
}