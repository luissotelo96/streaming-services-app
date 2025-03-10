import { Injectable } from '@angular/core';
import { SubscriptionDTO } from '../dtos/subscription.dto';
import { Subscription } from '../../domain/models/subscription.model';
import { SubscriptionStatusEnum } from '../../domain/enums/subscription-status.enum';
import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { SubscriptionFactory } from '../../domain/factories/subscription.factory';
import { addDays } from 'date-fns';
import { GetSubscriptionDTO } from '../dtos/get-subscription.dto';
import { SubscriptionEntity } from '../../infrastructure/entities/subscriptions.entity';
import { CustomerRepository } from '../../infrastructure/repositories/customer.repository';
import { YearlySubscription } from '../../domain/models/yearly-subscription.model';
import { PaymentFrequencyEnum } from '../../domain/enums/payment-frequency.enum';
import { SubscriptionPlanDTO } from '../dtos/subscription-plan.dto';
import { SubscriptionPlan } from '../../domain/models/subscription-plan.model';
import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { CustomerEntity } from '../../infrastructure/entities/customer.entity';
import { PlanEntity } from '../../infrastructure/entities/plan.entity';
import { SubscriptionEventService } from '../../infrastructure/services/subscription-events.service';
import { v4 as uuidv4 } from "uuid";
import { Customer } from '../../domain/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private subscriptionFactory: SubscriptionFactory,
    private customerRepository: CustomerRepository,
    private planRepository: PlanRepository,
    private subscriptionEventService: SubscriptionEventService
  ) {
  }

  public createSubscription(subscriptionDto: SubscriptionDTO): void {
    const customer = new Customer(subscriptionDto.customer.id, subscriptionDto.customer.name, subscriptionDto.customer.email);
    const subscription = this.subscriptionFactory.createSubscription(
      customer,
      this.mapPlanDTOToSubscriptionPlan(subscriptionDto.plan),
      subscriptionDto.paymentFrequency.name,
      new Date());

    customer.addSubscription(this.subscriptionRepository, subscription);

    this.subscriptionRepository.save(subscription);
  }

  public cancelSubscription(subscriptionId: string): GetSubscriptionDTO {
    const subscriptionEntity = this.subscriptionRepository.getById(subscriptionId);
    const subscription = this.mapSubscriptionEntitytoSubscription(subscriptionEntity);
    subscription.cancel();
    this.subscriptionRepository.update(subscriptionEntity.id, subscription);

    this.sendCanceledEventMessage(subscriptionEntity.id, subscription.getEndDate()!);
    return this.mapSubscriptionToDTO(subscription);
  }

  public changeSubscription(oldSubscriptionId: string, newSubscriptionDto: SubscriptionDTO): GetSubscriptionDTO {
    const oldSubscription = this.cancelSubscription(oldSubscriptionId);
    const newSubscriptionDate: Date = addDays(oldSubscription.endDate!, 1);
    const customer = new Customer(newSubscriptionDto.customer.id, newSubscriptionDto.customer.name, newSubscriptionDto.customer.email);

    const newSubscription = this.subscriptionFactory.createSubscription(
      customer,
      this.mapPlanDTOToSubscriptionPlan(newSubscriptionDto.plan),
      newSubscriptionDto.paymentFrequency.name,
      newSubscriptionDate,
      SubscriptionStatusEnum.INACTIVE
    );

    this.subscriptionRepository.save(newSubscription);
    return oldSubscription;
  }

  public getActiveSubscriptions(): GetSubscriptionDTO[] {
    const subscriptions: SubscriptionEntity[] = this.subscriptionRepository.getByStatus(SubscriptionStatusEnum.ACTIVE);

    const subscriptionsDto: GetSubscriptionDTO[] = subscriptions.map(sub => {
      return this.mapSubscriptionEntityToDTO(sub)
    });

    return subscriptionsDto;
  }

  public getSubscriptionById(subscriptionId: string): GetSubscriptionDTO {
    return this.mapSubscriptionEntityToDTO(this.subscriptionRepository.getById(subscriptionId));
  }

  public getAll(): GetSubscriptionDTO[] {
    return this.subscriptionRepository.getSubscriptions().map(sub => {
      return this.mapSubscriptionEntityToDTO(sub)
    });
  }

  private sendCanceledEventMessage(subscriptionId: string, endDate: Date): void {
    this.subscriptionEventService.sendCanceledEventMessage({
      header: {
        correlatonId: uuidv4(),
        source: 'streaming-services-app',
        user: 'luis_sotelo'
      },
      body: {
        subscriptionId: subscriptionId,
        endDate: endDate
      }
    });
  }

  private mapSubscriptionToDTO(subscription: Subscription): GetSubscriptionDTO {
    const customer = this.customerRepository.getById(subscription.getCustomer().id);
    const plan = subscription.getPlan();
    return {
      id: subscription.getId(),
      plan: this.mapPlanEntityToDTO(plan),
      monthlyCost: subscription.getMonthlyCost(),
      totalCost: subscription.getTotalCost(),
      paymentFrequency: subscription instanceof YearlySubscription ? PaymentFrequencyEnum.YEARLY : PaymentFrequencyEnum.MONTHLY,
      startDate: subscription.getStartDate(),
      endDate: subscription.getEndDate(),
      customer: this.mapCustomerEntityToDTO(customer),
      status: subscription.getStatus(),
      partialRefund: subscription.getPartialRefund()
    };
  }

  private mapSubscriptionEntityToDTO(subscriptionEntity: SubscriptionEntity): GetSubscriptionDTO {
    const customer = this.customerRepository.getById(subscriptionEntity.customerId);
    const plan = this.planRepository.getByName(subscriptionEntity.plan);
    return {
      id: subscriptionEntity.id,
      plan: this.mapPlanEntityToDTO(plan),
      monthlyCost: subscriptionEntity.monthlyCost,
      totalCost: subscriptionEntity.totalCost,
      paymentFrequency: subscriptionEntity.paymentFrecuency,
      startDate: subscriptionEntity.startDate,
      endDate: subscriptionEntity.endDate,
      customer: this.mapCustomerEntityToDTO(customer),
      status: subscriptionEntity.status,
      partialRefund: subscriptionEntity.partialRefund
    }
  }

  private mapPlanDTOToSubscriptionPlan(planDTO: SubscriptionPlanDTO): SubscriptionPlan {
    return {
      name: planDTO.name,
      monthlyCost: planDTO.monthlyCost,
      yearlyDiscount: planDTO.yearlyDiscount,
      partialRefundPercentaje: planDTO.partialRefundPercentaje
    };
  }

  private mapSubscriptionEntitytoSubscription(subscriptionEntity: SubscriptionEntity): Subscription {
    const customerEntity = this.customerRepository.getById(subscriptionEntity.customerId);

    const plan = this.planRepository.getByName(subscriptionEntity.plan);
    return this.subscriptionFactory.createSubscription(
      new Customer(customerEntity.id, customerEntity.name, customerEntity.email),
      new SubscriptionPlan(plan.name, plan.monthlyCost, plan.yearlyDiscount, plan.partialRefundPercentaje),
      subscriptionEntity.paymentFrecuency,
      subscriptionEntity.startDate
    );
  }

  private mapPlanEntityToDTO(plan: PlanEntity): SubscriptionPlanDTO {
    return {
      name: plan.name,
      monthlyCost: plan.monthlyCost,
      yearlyDiscount: plan.yearlyDiscount,
      partialRefundPercentaje: plan.partialRefundPercentaje
    };
  }

  private mapCustomerEntityToDTO(customer: CustomerEntity) {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email
    };
  }
}
