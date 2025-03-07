import { Injectable } from '@angular/core';
import { SubscriptionDTO } from '../models/subscription-dto.model';
import { Subscription } from '../../domain/models/subscription.model';
import { SubscriptionStatusEnum } from '../../domain/enums/subscription-status.enum';
import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { SubscriptionFactory } from '../../domain/factories/subscription-factory';
import { addDays } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private subscriptionFactory: SubscriptionFactory
  ) {
  }

  createSubscription(subscriptionDto: SubscriptionDTO): void {
    const customerSubscriptions: Subscription[] = this.subscriptionRepository.getByCustomerId(subscriptionDto.customerId);
    if (this.hasActiveSubscription(customerSubscriptions)) {
      throw new Error('El cliente ya tiene una subscripción activa.')
    }
    
    const subscription = this.subscriptionFactory.createSubscription(subscriptionDto.customerId, subscriptionDto.plan.name, subscriptionDto.plan.monthlyCost, subscriptionDto.paymentFrequency, new Date());
    this.subscriptionRepository.save(subscription);
  }

  cancelSubscription(subscriptionId: number): void {
    const subscription: Subscription | undefined = this.subscriptionRepository.getById(subscriptionId);
    if (subscription === undefined) {
      throw new Error(`Subscripción no encontrada.`)
    }

    subscription.cancel(); // TODO: Aplicar regla de reembolso parcial en anual
    this.subscriptionRepository.update(subscription);

    // TODO: Enviar a algún repositorio que envíe el evento de cancelar
  }

  changeSubscription(oldSubscriptionId: number, newSubscriptionDto: SubscriptionDTO): void {
    const oldSubscription: Subscription | undefined = this.subscriptionRepository.getById(oldSubscriptionId);
    if (oldSubscription === undefined) {
      throw new Error(`Subscripción no encontrada.`)
    }
    oldSubscription.cancel();
    // TODO: Enviar a algún repositorio que envíe el evento de cancelar

    const newSubscriptionDate: Date = addDays(oldSubscription.getEndDate()!, 1);
    const newSubscription = this.subscriptionFactory.createSubscription(newSubscriptionDto.customerId, newSubscriptionDto.plan.name, newSubscriptionDto.plan.monthlyCost, newSubscriptionDto.paymentFrequency, newSubscriptionDate);

    //TODO: Enviar a algún repositorio de evento de próximas subscripciones
  }

  private hasActiveSubscription(subscriptions: Subscription[]): boolean {
    const activeSubscription = subscriptions.find(s => s.getStatus() === SubscriptionStatusEnum.Active)
    return activeSubscription ? true : false;
  }
}
