import { Injectable } from "@angular/core";
import { PlanRepository } from "../../infrastructure/repositories/plan.repository";
import { SubscriptionPlanDTO } from "../dtos/subscription-plan.dto";
import { PlanEntity } from "../../infrastructure/entities/plan.entity";

@Injectable({
    providedIn: 'root'
})
export class PlanService {

    constructor(private planRepository: PlanRepository) {
    }

    public getPlans(): SubscriptionPlanDTO[] {
        return this.planRepository.getAll().map(plan => this.mapPlanEntityToPlanDTO(plan));
    }

    private mapPlanEntityToPlanDTO(planEntity: PlanEntity): SubscriptionPlanDTO {
        return {
            name: planEntity.name,
            monthlyCost: planEntity.monthlyCost,
            yearlyDiscount: planEntity.yearlyDiscount,
            partialRefundPercentaje: planEntity.partialRefundPercentaje
        }
    }
}