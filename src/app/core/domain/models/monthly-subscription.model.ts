import { Customer } from "./customer.model";
import { SubscriptionPlan } from "./subscription-plan.model";
import { Subscription } from "./subscription.model";

export class MonthlySubscription extends Subscription {

    constructor(
        customer: Customer,
        plan: SubscriptionPlan,
        startDate: Date,
        status: string
    ) {
        super(customer, plan, startDate, status);
    }

}