import { Injectable } from "@angular/core";
import { Subscription } from "../../domain/models/subscription.model";

@Injectable({
    providedIn: 'root',
})
export class SubscriptionRepository {
    private subscriptions: Subscription[] = [];

    getSubscriptions(): Subscription[] {
        return this.subscriptions;
    }

    addSubscription(subscription: Subscription): void {
        this.subscriptions.push(subscription);
    }

    updateSubscription(id: number, newSubscription: Subscription): void {
        const index = this.subscriptions.findIndex(sub => sub.id === id);
        if (index !== -1) {
            this.subscriptions[index] = newSubscription;
        }
    }

    cancelSubscription(id: number): void {
        this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
    }

    getSubscriptionsByCustomerId(customerId: number): Subscription[] {
        return this.subscriptions;
    }
}