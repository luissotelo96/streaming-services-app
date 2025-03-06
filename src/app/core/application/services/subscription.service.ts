import { Injectable } from '@angular/core';
import { SubscriptionDto } from '../models/subscriptiondto.model';
import { Subscription } from '../../domain/models/subscription.model';
import { SubscriptionStatusEnum } from '../../domain/enums/subscription-status.enum';
import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { DiscountStrategyContext } from '../../domain/services/strategies/discount-context.strategy';
import { DiscountStrategy } from '../../domain/services/strategies/discount.strategy';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private subscriptionRepository: SubscriptionRepository, private discountStrategyContext: DiscountStrategyContext) {
  }

  createSubscription(subscriptionDto: SubscriptionDto): void {

    const customerSubscriptions: Subscription[] = this.subscriptionRepository.getSubscriptionsByCustomerId(subscriptionDto.customerId);

    if (this.hasActiveSubscription(customerSubscriptions)) {
      throw new Error('El cliente ya tiene una subscripción activa.')
    }

    const discountStategy: DiscountStrategy = this.discountStrategyContext.getDiscountStrategy(subscriptionDto.paymentFrequency);
    const finalMonthlyCost = discountStategy.applyDiscount(subscriptionDto.monthlyCost);

    const subscription = new Subscription(id, subscriptionDto.customerId, plan, finalMonthlyCost, startDate, undefined, paymentFrequency);
  }

  private hasActiveSubscription(subscriptions: Subscription[]): boolean {
    const activeSubscription = subscriptions.find(s => s.status === SubscriptionStatusEnum.Active)
    return activeSubscription ? true : false;
  }
}
