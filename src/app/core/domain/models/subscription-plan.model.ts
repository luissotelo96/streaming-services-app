export class SubscriptionPlan {
    constructor(
        public name: string,
        public monthlyCost: number,
        public yearlyDiscount: number,
        public partialRefundPercentaje: number
    ) { }
}