import { Injectable } from "@angular/core";
import { Subscription } from "../../domain/models/subscription.model";

@Injectable({
    providedIn: 'root',
})
export class SubscriptionRepository {
    private subscriptions: Subscription[] = [];

    public getById(subscriptionId: number): Subscription | undefined {
        return this.subscriptions.find(s => s.getId() === subscriptionId);
    }

    public getSubscriptions(): Subscription[] {
        return this.subscriptions;
    }

    public save(subscription: Subscription): void {
        this.subscriptions.push(subscription);
    }

    public update(subscription: Subscription): void {
        const index = this.subscriptions.findIndex(sub => sub.getId() === subscription.getId());
        if (index !== -1) {
            this.subscriptions[index] = subscription;
        }
    }

    public change(subscriptionId: number, newSubscription: Subscription): void {
        const index = this.subscriptions.findIndex(sub => sub.getId() === subscriptionId);
        if (index !== -1) {
            this.subscriptions[index] = newSubscription;
        }
    }

    public cancel(subscriptionId: number): void {
        this.subscriptions = this.subscriptions.filter(sub => sub.getId() !== subscriptionId);
    }

    public getByCustomerId(customerId: number): Subscription[] {
        return this.subscriptions;
    }
}