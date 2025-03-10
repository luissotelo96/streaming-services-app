import { Injectable } from "@angular/core";
import { PlanEntity } from "../entities/plan.entity";

@Injectable({
    providedIn: 'root',
})
export class PlanRepository {
    private plans: PlanEntity[] = [
        { name: "Basic", monthlyCost: 15000, yearlyDiscount: 0.10, partialRefundPercentaje: 0.4 },
        { name: "Standard", monthlyCost: 20000, yearlyDiscount: 0.15, partialRefundPercentaje: 0.5 },
        { name: "Premium", monthlyCost: 30000, yearlyDiscount: 0.20, partialRefundPercentaje: 0.6 }
    ]

    constructor() { }

    public getAll(): PlanEntity[] {
        return this.plans;
    }

    public getByName(planName: string) {
        const plan = this.plans.find(p => p.name === planName);
        if (plan === undefined) {
            throw new Error(`Plan con nombre ${planName} no encontrado.`)
        }
        return plan;
    }
}