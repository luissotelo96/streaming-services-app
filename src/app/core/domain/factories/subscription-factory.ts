import { Injectable } from "@angular/core";
import { PaymentFrequencyEnum } from "../enums/payment-frequency.enum";
import { Subscription } from "../models/subscription.model";
import { YearlySubscription } from "../models/yearly-subscription.model";
import { MonthlySubscription } from "../models/monthly-subscription.model";
import { MonthlyDiscountStrategy } from "../strategies/monthly-discount.strategy";
import { DiscountStrategyContext } from "../strategies/discount-context.strategy";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionFactory {

    constructor(private discountStrategyContext: DiscountStrategyContext) {
    }

    createSubscription(
        customerId: number,
        plan: string,
        baseCost: number,
        paymentFrequency: string,
        startDate: Date
    ): Subscription {

        switch (paymentFrequency) {
            case PaymentFrequencyEnum.Yearly:
                this.discountStrategyContext.setStrategy(new MonthlyDiscountStrategy());
                return new YearlySubscription(customerId, plan, baseCost, startDate, this.discountStrategyContext);
            case PaymentFrequencyEnum.Monthly:
                return new MonthlySubscription(customerId, plan, baseCost, startDate, this.discountStrategyContext);
            default:
                throw new Error(`Frecuencia de pago ${paymentFrequency} no soportada.`)
        }
    }
}