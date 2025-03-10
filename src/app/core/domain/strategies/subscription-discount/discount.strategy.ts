export interface DiscountStrategy {
    applyDiscount(monthlyCost: number, discountPercentaje: number): number;
}