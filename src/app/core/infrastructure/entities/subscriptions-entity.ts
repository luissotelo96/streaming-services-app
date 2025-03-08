export class SubscriptionEntity {
    constructor(
        public id: number,
        public customerId: number,
        public plan: string,
        public baseCost: number,
        public finalCost: number,
        public startDate: Date,
        public paymentFrecuency: string,
        public status: string,
        public endDate?: Date,
    ) {
    }
}