import { PaymentFrequencyDTO } from "./payment-frequency-dto.model";
import { SubscriptionPlanDTO } from "./subscription-plan-dto.enum";

export interface SubscriptionDTO {
    customerId: number;
    plan: SubscriptionPlanDTO
    paymentFrequency: PaymentFrequencyDTO
}