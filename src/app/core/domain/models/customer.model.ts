import { Subscription } from "./subscription.model";

export class Customer {
    constructor(
        public readonly id: number,
        public name: string,
        public email: string,
        public subscription?: Subscription
    ) { }

    hasActiveSubscription(): boolean {
        return this.subscription !== undefined;
    }

    cancelSubscription(): void {
        this.subscription = undefined;
    }

    updateSubscription(newSubscription: Subscription): void {
        this.subscription = newSubscription;
    }
}