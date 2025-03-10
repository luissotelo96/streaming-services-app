import { Customer } from "./customer.model";
import { SubscriptionPlan } from "./subscription-plan.model";
import { Subscription } from "./subscription.model";
import { differenceInMonths } from "date-fns";

export abstract class PartiallyRefundableSubscription extends Subscription {
    constructor(
        customer: Customer,
        plan: SubscriptionPlan,
        startDate: Date,
        status: string
    ) {
        super(customer, plan, startDate, status);
    }

    public override cancel(): void {
        super.cancel();
        this.partialRefund = this.calculatePartialRefund();
    }

    private calculatePartialRefund(): number {
        const today = new Date();
        const scheduleEndDate = this.startDate.setFullYear(this.startDate.getFullYear() + 1);

        if (scheduleEndDate === undefined) {
            throw new Error('No fue posible obtener la fecha fin de la subscripción para reembolso parcial.')
        }

        const remainingMonths = differenceInMonths(scheduleEndDate, today);
        if (remainingMonths <= 0) {
            throw new Error('Subscripción expirada. No es posible realizar reembolso');
        }

        const reaminingValue = this.monthlyCost * remainingMonths;
        const partialRefundPercentaje = this.plan.partialRefundPercentaje;

        return reaminingValue * partialRefundPercentaje;
    }
}