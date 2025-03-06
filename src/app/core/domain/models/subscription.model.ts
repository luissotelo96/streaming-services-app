import { SubscriptionPlanEnum } from '../enums/suscription-plan.enum';
import { PaymentFrequencyEnum } from '../enums/payment-frequency.enum';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';

export class Subscription {
    constructor(
        public readonly id: number,
        public customerId: number,
        public plan: SubscriptionPlanEnum,
        public monthlyCost: number,
        public startDate: Date,
        public endDate?: Date,
        public status: SubscriptionStatusEnum = SubscriptionStatusEnum.Active,
        public paymentFrequency: PaymentFrequencyEnum = PaymentFrequencyEnum.Monthly
    ) {
        this.customerId = customerId;
     }
}