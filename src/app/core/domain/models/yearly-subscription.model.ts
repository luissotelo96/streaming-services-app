import { DiscountStrategyContext } from "../strategies/subscription-discount/discount-context.strategy";
import { PartiallyRefundableSubscription } from "./partially-refundable-subscription";
import { SubscriptionPlan } from "./subscription-plan.model";

export class YearlySubscription extends PartiallyRefundableSubscription {
    private static readonly MONTHS_YEAR = 12;
    constructor(
        customerId: string,
        plan: SubscriptionPlan,
        startDate: Date,
        status: string,
        private discountStrategy: DiscountStrategyContext,
    ) {
        super(customerId, plan, startDate, status);
        this.calculateMonthlyCost();
        this.calculateTotalCost();
    }

    private calculateMonthlyCost(): void {
        this.monthlyCost = this.discountStrategy.executeStrategy(this.getMonthlyCost(), this.getPlan().yearlyDiscount);
    }

    private calculateTotalCost(): void {
        this.totalCost = this.monthlyCost * YearlySubscription.MONTHS_YEAR;
    }
}