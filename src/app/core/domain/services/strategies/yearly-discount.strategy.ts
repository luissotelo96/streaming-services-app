import { DiscountStrategy } from './discount.strategy';

export class YearlyDiscountStrategy implements DiscountStrategy {
    private readonly discountRate = 0.10; // 10% TODO: traer desde environment

    applyDiscount(monthlyCost: number): number {
        const yearlyCost = monthlyCost * 12;
        const discountedYearlyCost = yearlyCost * (1 - this.discountRate);
        return discountedYearlyCost / 12;
    }
}