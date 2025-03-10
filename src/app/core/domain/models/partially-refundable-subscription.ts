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
        const endDate = this.getEndDate();

        if (endDate === undefined) {
            throw new Error('No fue posible obtener la fecha fin de la subscripción para reembolso parcial.')
        }

        const remainingMonths = differenceInMonths(endDate, today);
        if (remainingMonths <= 0) {
            throw new Error('Subscripción expirada. No es posible realizar reembolso');
        }

        const reaminingValue = this.getMonthlyCost() * remainingMonths;
        const partialRefundPercentaje = this.getPlan().partialRefundPercentaje;

        return reaminingValue * partialRefundPercentaje;
    }
}