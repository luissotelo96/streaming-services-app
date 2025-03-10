import { DiscountStrategy } from "./discount.strategy";

export class MonthlyDiscountStrategy implements DiscountStrategy {
    applyDiscount(monthlyCost: number, discountPercentaje: number): number {
        return monthlyCost;
    }
}