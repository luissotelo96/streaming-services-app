import { Injectable } from "@angular/core";
import { PaymentFrequencyEnum } from "../enums/payment-frequency.enum";
import { Subscription } from "../models/subscription.model";
import { YearlySubscription } from "../models/yearly-subscription.model";
import { MonthlySubscription } from "../models/monthly-subscription.model";
import { DiscountStrategyContext } from "../strategies/subscription-discount/discount-context.strategy";
import { YearlyDiscountStrategy } from "../strategies/subscription-discount/yearly-discount.strategy";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { SubscriptionPlan } from "../models/subscription-plan.model";
import { Customer } from "../models/customer.model";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionFactory {

    constructor(private discountStrategyContext: DiscountStrategyContext) { }

    createSubscription(
        customer: Customer,
        plan: SubscriptionPlan,
        paymentFrequency: string,
        startDate: Date,
        status: string = SubscriptionStatusEnum.ACTIVE
    ): Subscription {
        switch (paymentFrequency) {
            case PaymentFrequencyEnum.YEARLY:
                this.discountStrategyContext.setStrategy(new YearlyDiscountStrategy());
                return new YearlySubscription(customer, plan, startDate, status, this.discountStrategyContext);
            case PaymentFrequencyEnum.MONTHLY:
                return new MonthlySubscription(customer, plan, startDate, status);
            default:
                throw new Error(`Frecuencia de pago ${paymentFrequency} no soportada.`)
        }
    }
}