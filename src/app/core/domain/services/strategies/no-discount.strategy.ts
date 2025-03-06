import { DiscountStrategy } from './discount.strategy';

export class NoDiscountStrategy implements DiscountStrategy {
    applyDiscount(monthlyCost: number): number {
        return monthlyCost;
    }
}