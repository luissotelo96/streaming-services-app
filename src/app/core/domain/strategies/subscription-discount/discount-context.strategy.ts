import { Injectable } from "@angular/core";
import { DiscountStrategy } from "./discount.strategy";

@Injectable({
    providedIn: 'root'
})
export class DiscountStrategyContext {

    private strategy!: DiscountStrategy;

    public setStrategy(strategy: DiscountStrategy) {
        this.strategy = strategy;
    }

    public executeStrategy(baseCost: number, discountPercentaje: number): number {

        if (!this.strategy) {
            throw new Error("No se ha establecido una estrategia de descuento.");
        }

        return this.strategy.applyDiscount(baseCost, discountPercentaje);
    }

}