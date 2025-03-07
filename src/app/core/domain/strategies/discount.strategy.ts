export interface DiscountStrategy {
    applyDiscount(monthlyCost: number): number;
}