import { addMonths, getDate, getYear } from 'date-fns';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';
import { SubscriptionPlanEnum } from '../enums/suscription-plan.enum';
import { DiscountStrategyContext } from '../strategies/discount-context.strategy';

export abstract class Subscription {
    private readonly id: number = 0;
    private customerId: number;
    private plan: SubscriptionPlanEnum;
    private status: SubscriptionStatusEnum;
    private baseCost: number;
    private finalCost: number;
    private startDate: Date;
    private endDate?: Date;

    constructor(
        customerId: number,
        plan: string,
        baseCost: number,
        startDate: Date,
        protected discountStrategy: DiscountStrategyContext
    ) {
        this.customerId = customerId;
        this.baseCost = baseCost;
        this.plan = this.parseEnum(SubscriptionPlanEnum, plan);
        this.status = SubscriptionStatusEnum.Active;
        this.startDate = startDate;

        this.finalCost = this.calculateTotalCost();
    }

    public cancel(): void {
        const nextMonthDate = addMonths(new Date(), 1);
        this.endDate = new Date(getYear(nextMonthDate), nextMonthDate.getMonth(), getDate(this.startDate));
    }

    private calculateTotalCost(): number {
        return this.discountStrategy.executeStrategy(this.baseCost);
    }

    public getId() {
        return this.id;
    }

    public getCustomerId() {
        return this.customerId;
    }

    public getPlan() {
        return this.plan;
    }

    public getStatus() {
        return this.status;
    }

    public getBaseCost() {
        return this.baseCost;
    }

    public getFinalCost() {
        return this.finalCost;
    }

    public getStartDate() {
        return this.startDate;
    }

    public getEndDate() {
        return this.endDate;
    }

    private parseEnum<T extends Record<string, string | number>>(enumType: T, value: string): T[keyof T] {
        if (Object.values(enumType).includes(value as T[keyof T])) {
            return value as T[keyof T];
        }
        throw new Error(`El valor '${value}' no es válido para el Enum.`);
    }

}