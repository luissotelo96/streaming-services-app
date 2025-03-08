import { Injectable } from '@angular/core';
import { SubscriptionDTO } from '../dtos/subscription-dto.model';
import { Subscription } from '../../domain/models/subscription.model';
import { SubscriptionStatusEnum } from '../../domain/enums/subscription-status.enum';
import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { SubscriptionFactory } from '../../domain/factories/subscription-factory';
import { addDays } from 'date-fns';
import { GetSubscriptionDTO } from '../dtos/get-subscription-dto.model';
import { SubscriptionEntity } from '../../infrastructure/entities/subscriptions-entity';
import { CustomerRepository } from '../../infrastructure/repositories/customer-repository';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private subscriptionFactory: SubscriptionFactory,
    private customerRepository: CustomerRepository
  ) {
  }

  public createSubscription(subscriptionDto: SubscriptionDTO): void {
    const customerSubscriptions: Subscription[] = this.subscriptionRepository.getByCustomerId(subscriptionDto.customerId);
    if (this.hasActiveSubscription(customerSubscriptions)) {
      throw new Error('El cliente ya tiene una subscripción activa.')
    }

    const subscription = this.subscriptionFactory.createSubscription(subscriptionDto.customerId, subscriptionDto.plan.name, subscriptionDto.plan.monthlyCost, subscriptionDto.paymentFrequency, new Date());
    this.subscriptionRepository.save(subscription);
  }

  public cancelSubscription(subscriptionId: number): void {
    const subscription: Subscription = this.subscriptionRepository.getById(subscriptionId);
    subscription.cancel(); // TODO: Aplicar regla de reembolso parcial en anual
    this.subscriptionRepository.update(subscription);
    // TODO: Enviar a algún repositorio que envíe el evento de cancelar
  }

  public changeSubscription(oldSubscriptionId: number, newSubscriptionDto: SubscriptionDTO): void {
    const oldSubscription: Subscription | undefined = this.subscriptionRepository.getById(oldSubscriptionId);
    oldSubscription.cancel();
    // TODO: Enviar a algún repositorio que envíe el evento de cancelar

    const newSubscriptionDate: Date = addDays(oldSubscription.getEndDate()!, 1);
    const newSubscription = this.subscriptionFactory.createSubscription(newSubscriptionDto.customerId, newSubscriptionDto.plan.name, newSubscriptionDto.plan.monthlyCost, newSubscriptionDto.paymentFrequency, newSubscriptionDate);

    //TODO: Enviar a algún repositorio de evento de próximas subscripciones
  }

  public getActiveSubscriptions(): GetSubscriptionDTO[] {
    const subscriptions: SubscriptionEntity[] = this.subscriptionRepository.getSubscriptionsByStatus(SubscriptionStatusEnum.Active);

    const subscriptionsDto: GetSubscriptionDTO[] = subscriptions.map(sub => {
      const customer = this.customerRepository.getById(sub.customerId);

      return {
        plan: {
          name: sub.plan,
          monthlyCost: sub.baseCost, //volver getmontlycost abstracto para implementar costo mensual en anual
          yearlyDiscount: 0, //persistir este dato
        },
        finalCost: sub.finalCost,
        paymentFrequency: sub.paymentFrecuency,
        startDate: sub.startDate,
        endDate: sub.endDate,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email
        }
      }
    });

    return subscriptionsDto;
  }

  private hasActiveSubscription(subscriptions: Subscription[]): boolean {
    const activeSubscription = subscriptions.find(s => s.getStatus() === SubscriptionStatusEnum.Active)
    return activeSubscription ? true : false;
  }
}
