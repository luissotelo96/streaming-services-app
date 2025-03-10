import { addMonths, getDate, getYear, isSameDay } from 'date-fns';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';
import { SubscriptionPlan } from './subscription-plan.model';
import { Customer } from './customer.model';

export abstract class Subscription {
    private readonly id: string = "";
    private customer: Customer;
    private status: SubscriptionStatusEnum;
    private readonly plan: SubscriptionPlan;
    private readonly startDate: Date;
    private endDate?: Date;
    protected monthlyCost: number;
    protected totalCost: number = 0;
    protected partialRefund: number = 0;

    constructor(
        customer: Customer,
        plan: SubscriptionPlan,
        startDate: Date,
        status: string = SubscriptionStatusEnum.ACTIVE
    ) {
        this.customer = customer;
        this.monthlyCost = plan.monthlyCost;
        this.plan = plan;
        this.status = this.parseEnum(SubscriptionStatusEnum, status);
        this.startDate = startDate;
    }

    public cancel(): void {
        const today = new Date();
        const endDate = this.calculateEndDate(today);

        if (isSameDay(today, endDate)) {
            this.status = SubscriptionStatusEnum.CANCELED;
        }
        this.endDate = this.calculateEndDate(today);
    }

    private calculateEndDate(today: Date): Date {
        const nextMonthDate = addMonths(new Date(today), 1);
        return new Date(getYear(nextMonthDate), nextMonthDate.getMonth(), getDate(this.startDate));
    }

    public getId() {
        return this.id;
    }

    public getCustomer() {
        return this.customer;
    }

    public getPlan() {
        return this.plan;
    }

    public getStatus() {
        return this.status;
    }

    public getMonthlyCost() {
        return this.monthlyCost;
    }

    public getTotalCost() {
        return this.totalCost;
    }

    public getStartDate() {
        return this.startDate;
    }

    public getEndDate() {
        return this.endDate;
    }

    public getPartialRefund() {
        return this.partialRefund;
    }

    private parseEnum<T extends Record<string, string | number>>(enumType: T, value: string): T[keyof T] {
        if (Object.values(enumType).includes(value as T[keyof T])) {
            return value as T[keyof T];
        }
        throw new Error(`El valor '${value}' no es válido para el Enum.`);
    }

}