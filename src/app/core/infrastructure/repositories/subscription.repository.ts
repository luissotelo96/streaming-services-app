import { Injectable } from "@angular/core";
import { Subscription } from "../../domain/models/subscription.model";
import { SubscriptionEntity } from "../entities/subscriptions.entity";
import { SubscriptionFactory } from "../../domain/factories/subscription.factory";
import { YearlySubscription } from "../../domain/models/yearly-subscription.model";
import { PaymentFrequencyEnum } from "../../domain/enums/payment-frequency.enum";
import { SubscriptionPlanEnum } from "../../domain/enums/suscription-plan.enum";
import { SubscriptionStatusEnum } from "../../domain/enums/subscription-status.enum";
import { v4 as uuidv4 } from "uuid";

@Injectable({
    providedIn: 'root',
})
export class SubscriptionRepository {

    private subscriptions: SubscriptionEntity[] = [
        {
            id: "29d1a9a2-b1cd-4ec2-a082-5f7a1ffd8cca",
            customerId: "3f7f91eb-d2ed-4157-8b51-be6db8ecc969",
            plan: SubscriptionPlanEnum.BASIC,
            monthlyCost: 10000,
            totalCost: 10000,
            startDate: new Date(2025, 2, 2),
            paymentFrecuency: PaymentFrequencyEnum.MONTHLY,
            status: SubscriptionStatusEnum.ACTIVE,
            partialRefund: 0
        },
        {
            id: "aaa2a3fa-0ce7-4ef8-b4d4-24198908bf59",
            customerId: "afeccac1-97a3-4eb6-9cb1-1f850d0a116f",
            plan: SubscriptionPlanEnum.BASIC,
            monthlyCost: 10000,
            totalCost: 10000,
            startDate: new Date(2025, 1, 15),
            paymentFrecuency: PaymentFrequencyEnum.MONTHLY,
            status: SubscriptionStatusEnum.ACTIVE,
            partialRefund: 0
        },
        {
            id: "996a7c35-b402-4872-a2b1-0ddf43972bb7",
            customerId: "afeccac1-97a3-4eb6-9cb1-1f850d0a116f",
            plan: SubscriptionPlanEnum.BASIC,
            monthlyCost: 10000,
            totalCost: 10000,
            startDate: new Date(2024, 11, 1),
            paymentFrecuency: PaymentFrequencyEnum.MONTHLY,
            status: SubscriptionStatusEnum.CANCELED,
            partialRefund: 0,
            endDate: new Date(2024, 12, 1)
        }
    ];

    constructor(private subscriptionFactory: SubscriptionFactory) {
    }

    public save(subscription: Subscription): void {
        const newId = uuidv4();
        const newSubscriptionEntity: SubscriptionEntity = new SubscriptionEntity(
            newId,
            subscription.getCustomerId(),
            subscription.getPlan().name,
            subscription.getMonthlyCost(),
            subscription.getTotalCost(),
            subscription.getStartDate(),
            subscription instanceof YearlySubscription ? PaymentFrequencyEnum.YEARLY : PaymentFrequencyEnum.MONTHLY,
            subscription.getStatus(),
            subscription.getPartialRefund()
        );
        this.subscriptions.push(newSubscriptionEntity);
    }

    public update(subscriptionId: string, subscription: Subscription): void {
        const index = this.subscriptions.findIndex(sub => sub.id === subscriptionId);
        if (index !== -1) {
            this.subscriptions[index] = new SubscriptionEntity(
                subscriptionId,
                subscription.getCustomerId(),
                subscription.getPlan().name,
                subscription.getMonthlyCost(),
                subscription.getTotalCost(),
                subscription.getStartDate(),
                subscription instanceof YearlySubscription ? PaymentFrequencyEnum.YEARLY : PaymentFrequencyEnum.MONTHLY,
                subscription.getStatus(),
                subscription.getPartialRefund(),
                subscription.getEndDate()
            )
        }
    }

    public change(subscriptionId: string, newSubscription: Subscription): void {
        const index = this.subscriptions.findIndex(sub => sub.id === subscriptionId);
        if (index !== -1) {
            const newId = uuidv4();
            this.subscriptions[index] = new SubscriptionEntity(
                newId,
                newSubscription.getCustomerId(),
                newSubscription.getPlan().name,
                newSubscription.getMonthlyCost(),
                newSubscription.getTotalCost(),
                newSubscription.getStartDate(),
                newSubscription instanceof YearlySubscription ? PaymentFrequencyEnum.YEARLY : PaymentFrequencyEnum.MONTHLY,
                newSubscription.getStatus(),
                newSubscription.getPartialRefund(),
            );;
        }
    }

    public getById(subscriptionId: string): SubscriptionEntity {
        const subscriptionEntity = this.subscriptions.find(s => s.id === subscriptionId);
        if (subscriptionEntity === undefined) {
            throw new Error(`Subscripción no encontrada con id ${subscriptionId}.`)
        }
        return subscriptionEntity;
    }

    public getSubscriptions(): SubscriptionEntity[] {
        return this.subscriptions;
    }

    public getByStatus(status: string): SubscriptionEntity[] {
        const subscriptionsEntities = this.subscriptions.filter(s => s.status === status);
        return subscriptionsEntities ?? [];
    }

    public getByCustomerId(customerId: string): SubscriptionEntity[] {
        const subscriptionsEntities = this.subscriptions.filter(s => s.customerId === customerId);
        return subscriptionsEntities ?? [];
    }

}