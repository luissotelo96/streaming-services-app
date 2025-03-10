import { SubscriptionRepository } from "../../infrastructure/repositories/subscription.repository";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { Subscription } from "./subscription.model";

export class Customer {
    private subscriptions: Subscription[];
    constructor(
        public readonly id: string,
        public name: string,
        public email: string
    ) {
        this.subscriptions = [];
    }

    public addSubscription(subscriptionRepository: SubscriptionRepository, subscription: Subscription): void {

        const activeSubscription = subscriptionRepository.getByCustomerId(this.id).some(s => s.status === SubscriptionStatusEnum.ACTIVE);
        if (activeSubscription) {
            throw new Error('El cliente ya tiene una subscripción activa.')
        }
        this.subscriptions.push(subscription);
    }
}