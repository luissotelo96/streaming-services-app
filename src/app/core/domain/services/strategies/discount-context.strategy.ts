import { Injectable } from "@angular/core";
import { PaymentFrequencyEnum } from "../../enums/payment-frequency.enum";
import { DiscountStrategy } from "./discount.strategy";
import { NoDiscountStrategy } from "./no-discount.strategy";
import { YearlyDiscountStrategy } from "./yearly-discount.strategy";

@Injectable({
    providedIn: 'root'
})
export class DiscountStrategyContext {
    getDiscountStrategy(paymentFrequency: string): DiscountStrategy {
        return paymentFrequency === PaymentFrequencyEnum.Yearly ? new YearlyDiscountStrategy() : new NoDiscountStrategy();
    }
}