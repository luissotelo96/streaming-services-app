export class PlanEntity {
    constructor(
        public name: string,
        public monthlyCost: number,
        public yearlyDiscount: number,
        public partialRefundPercentaje: number
    ) { }
}