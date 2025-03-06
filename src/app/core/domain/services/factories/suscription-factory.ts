import { PaymentFrequencyEnum } from "../../enums/payment-frequency.enum";
import { SubscriptionPlanEnum } from "../../enums/suscription-plan.enum";
import { Subscription } from "../../models/subscription.model";
import { DiscountStrategy } from "../strategies/discount.strategy";
import { NoDiscountStrategy } from "../strategies/no-discount.strategy";
import { YearlyDiscountStrategy } from "../strategies/yearly-discount.strategy";

export class SuscriptionFactory {
    static createSubscription(
        id: number,
        customerId: number,
        plan: SubscriptionPlanEnum,
        monthlyCost: number,
        startDate: Date,
        paymentFrequency: PaymentFrequencyEnum
    ): Subscription {
        const discountStategy: DiscountStrategy = paymentFrequency === PaymentFrequencyEnum.Yearly ? new YearlyDiscountStrategy() : new NoDiscountStrategy();

        const finalMonthlyCost = discountStategy.applyDiscount(monthlyCost);

        return new Subscription(id, customerId, plan, finalMonthlyCost, startDate, undefined, paymentFrequency);
    }
}