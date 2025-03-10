import { CustomerDTO } from "./customer.dto";
import { SubscriptionPlanDTO } from "./subscription-plan.dto";

export interface GetSubscriptionDTO {
    id: string;
    plan: SubscriptionPlanDTO;
    paymentFrequency: string;
    startDate: Date;
    endDate?: Date
    monthlyCost: number;
    totalCost: number;
    customer: CustomerDTO;
    status: string;
    partialRefund: number;
}