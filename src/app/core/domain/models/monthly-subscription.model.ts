import { DiscountStrategyContext } from "../strategies/subscription-discount/discount-context.strategy";
import { SubscriptionPlan } from "./subscription-plan.model";
import { Subscription } from "./subscription.model";

export class MonthlySubscription extends Subscription {

    constructor(
        customerId: string,
        plan: SubscriptionPlan,
        startDate: Date,
        status: string
    ) {
        super(customerId, plan, startDate, status);
    }

}