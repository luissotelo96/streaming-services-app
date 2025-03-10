export class SubscriptionEntity {
    constructor(
        public id: string,
        public customerId: string,
        public plan: string,
        public monthlyCost: number,
        public totalCost: number,
        public startDate: Date,
        public paymentFrecuency: string,
        public status: string,
        public partialRefund: number,
        public endDate?: Date
    ) {
    }
}