import { CustomerDTO } from "./customer.dto";
import { PaymentFrequencyDTO } from "./payment-frequency.dto";
import { SubscriptionPlanDTO } from "./subscription-plan.dto";

export interface SubscriptionDTO {
    customer: CustomerDTO;
    plan: SubscriptionPlanDTO;
    paymentFrequency: PaymentFrequencyDTO;
}