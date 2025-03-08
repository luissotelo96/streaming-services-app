import { GetCustomerDTO } from "./get-customer-dto.model";
import { SubscriptionPlanDTO } from "./subscription-plan-dto.enum";

export interface GetSubscriptionDTO {
    plan: SubscriptionPlanDTO
    paymentFrequency: string,
    startDate: Date,
    endDate?: Date
    finalCost: number,
    customer: GetCustomerDTO
}