import { DiscountStrategyContext } from "../strategies/discount-context.strategy";
import { DiscountStrategy } from "../strategies/discount.strategy";
import { Subscription } from "./subscription.model";

export class YearlySubscription extends Subscription {

    constructor(
        customerId: number,
        plan: string,
        baseCost: number,
        startDate: Date,
        discountStrategy: DiscountStrategyContext
    ) {
        super(customerId, plan, baseCost, startDate, discountStrategy);
    }
}