import { Injectable } from "@angular/core";
import { Subscription } from "../../domain/models/subscription.model";
import { SubscriptionEntity } from "../entities/subscriptions-entity";
import { SubscriptionFactory } from "../../domain/factories/subscription-factory";
import { YearlySubscription } from "../../domain/models/yearly-subscription.model";
import { PaymentFrequencyEnum } from "../../domain/enums/payment-frequency.enum";
import { SubscriptionPlanEnum } from "../../domain/enums/suscription-plan.enum";
import { SubscriptionStatusEnum } from "../../domain/enums/subscription-status.enum";

@Injectable({
    providedIn: 'root',
})
export class SubscriptionRepository {

    private subscriptions: SubscriptionEntity[] = [
        { id: 1, customerId: 1, plan: SubscriptionPlanEnum.Basic, baseCost: 10000, finalCost: 10000, startDate: new Date(2025, 2, 1), paymentFrecuency: PaymentFrequencyEnum.Monthly, status: SubscriptionStatusEnum.Active },
        { id: 2, customerId: 2, plan: SubscriptionPlanEnum.Basic, baseCost: 10000, finalCost: 10000, startDate: new Date(2025, 3, 1), paymentFrecuency: PaymentFrequencyEnum.Monthly, status: SubscriptionStatusEnum.Active },
        { id: 3, customerId: 2, plan: SubscriptionPlanEnum.Basic, baseCost: 10000, finalCost: 10000, startDate: new Date(2024, 11, 1), paymentFrecuency: PaymentFrequencyEnum.Monthly, status: SubscriptionStatusEnum.Canceled, endDate: new Date(2024, 12, 1) }
    ];

    constructor(private subscriptionFactory: SubscriptionFactory) {

    }

    public save(subscription: Subscription): void {
        const newId = Math.random() * 100;
        const newSubscriptionEntity: SubscriptionEntity = new SubscriptionEntity(
            newId,
            subscription.getCustomerId(),
            subscription.getPlan(),
            subscription.getBaseCost(),
            subscription.getFinalCost(),
            subscription.getStartDate(),
            subscription.getStatus(),
            subscription instanceof YearlySubscription ? PaymentFrequencyEnum.Yearly : PaymentFrequencyEnum.Monthly
        );
        this.subscriptions.push(newSubscriptionEntity);
    }

    public update(subscription: Subscription): void {
        const index = this.subscriptions.findIndex(sub => sub.id === subscription.getId());
        if (index !== -1) {
            this.subscriptions[index] = this.mapSubscriptionToSubscritionEntity(subscription);
        }
    }

    public change(subscriptionId: number, newSubscription: Subscription): void {
        const index = this.subscriptions.findIndex(sub => sub.id === subscriptionId);
        if (index !== -1) {
            const newId = Math.random() * 100;
            this.subscriptions[index] = new SubscriptionEntity(
                newId,
                newSubscription.getCustomerId(),
                newSubscription.getPlan(),
                newSubscription.getBaseCost(),
                newSubscription.getFinalCost(),
                newSubscription.getStartDate(),
                newSubscription.getStatus(),
                newSubscription instanceof YearlySubscription ? PaymentFrequencyEnum.Yearly : PaymentFrequencyEnum.Monthly
            );;
        }
    }

    public getById(subscriptionId: number): Subscription {
        const subscriptionEntity = this.subscriptions.find(s => s.id === subscriptionId);
        if (subscriptionEntity === undefined) {
            throw new Error(`Subscripción no encontrada con id ${subscriptionId}.`)
        }
        return this.mapSubscriptionEntitytoSubscription(subscriptionEntity);
    }

    public getSubscriptions(): SubscriptionEntity[] {
        return this.subscriptions;
    }

    public getSubscriptionsByStatus(status: string): SubscriptionEntity[] {
        const subscriptionsEntities = this.subscriptions.filter(s => s.status === status);
        return subscriptionsEntities ?? [];
    }

    public getByCustomerId(customerId: number): Subscription[] {
        const subscriptionsEntities = this.subscriptions.filter(s => s.customerId === customerId);

        return subscriptionsEntities ? subscriptionsEntities.map(sub => this.mapSubscriptionEntitytoSubscription(sub)) : [];
    }

    private mapSubscriptionToSubscritionEntity(subscription: Subscription) {
        return new SubscriptionEntity(
            subscription.getId(),
            subscription.getCustomerId(),
            subscription.getPlan(),
            subscription.getBaseCost(),
            subscription.getFinalCost(),
            subscription.getStartDate(),
            subscription.getStatus(),
            subscription instanceof YearlySubscription ? PaymentFrequencyEnum.Yearly : PaymentFrequencyEnum.Monthly
        )
    }

    private mapSubscriptionEntitytoSubscription(subscriptionEntity: SubscriptionEntity) {
        return this.subscriptionFactory.createSubscription(
            subscriptionEntity.customerId,
            subscriptionEntity.plan,
            subscriptionEntity.baseCost,
            subscriptionEntity.paymentFrecuency,
            subscriptionEntity.startDate
        );
    }
}