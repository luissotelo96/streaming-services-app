import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { SubscriptionPlanDTO } from '../../core/application/dtos/subscription-plan.dto';
import { PaymentFrequencyDTO } from '../../core/application/dtos/payment-frequency.dto';
import { SubscriptionService } from '../../core/application/services/subscription.service';
import { CustomerService } from '../../core/application/services/customer.service';
import { CustomerDTO } from '../../core/application/dtos/customer.dto';
import { SubscriptionDTO } from '../../core/application/dtos/subscription.dto';
import { GetSubscriptionDTO } from '../../core/application/dtos/get-subscription.dto';
import { PlanService } from '../../core/application/services/plan.service';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrl: './create-subscription.component.scss'
})
export class CreateSubscriptionComponent implements OnInit {
  subscriptionForm!: FormGroup;

  subscriptionPlans: SubscriptionPlanDTO[] = [];

  readonly paymentFrequencies: PaymentFrequencyDTO[] = [
    { name: 'Monthly' },
    { name: 'Yearly' }
  ]

  customer?: CustomerDTO | undefined = undefined;
  subscriptionId: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly subscriptionService: SubscriptionService,
    private readonly customerService: CustomerService,
    private readonly planService: PlanService
  ) {
    this.subscriptionForm = this.formBuilder.group({
      customerName: ["", [Validators.required]],
      customerEmail: ["", [Validators.required, Validators.email]],
      subscriptionPlan: [null, [Validators.required]],
      paymentFrequency: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.subscriptionId = params.get('id');
      if (this.subscriptionId) {
        this.loadSubscription(this.subscriptionId);
      }
    });

    this.getPlans();
  }

  searchCustomer(): void {
    try {
      const email = this.subscriptionForm.get('customerEmail')?.value;
      this.customer = this.customerService.getCustomerByEmail(email);
      if (this.customer) {
        this.subscriptionForm.patchValue({ customerName: this.customer.name });
        this.subscriptionForm.patchValue({ customerEmail: this.customer.email });
      }
    }
    catch (error) {
      Swal.fire('Error', `${error}`, 'error');
    }
  }

  goBackToSubscription(): void {
    this.router.navigate(['/subscription']);
  }

  selectPlan(plan: SubscriptionPlanDTO): void {
    this.subscriptionForm.patchValue({ subscriptionPlan: plan });
  }

  createSubscription(): void {
    if (!this.isFormValid()) return;

    try {
      const subscriptionDto = this.createSubscriptionDto();
      this.subscriptionService.createSubscription(subscriptionDto);
      Swal.fire({
        title: '¡Éxito!',
        text: 'La suscripción se ha creado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigate(['/subscription']);
    }
    catch (error) {
      Swal.fire('Error', `${error}`, 'error');
    }

  }

  changeSubscription(): void {
    if (!this.subscriptionId || !this.isFormValid()) return;

    try {
      const subscriptionDto = this.createSubscriptionDto();
      const result: GetSubscriptionDTO = this.subscriptionService.changeSubscription(this.subscriptionId, subscriptionDto);
      if (result.endDate) {
        Swal.fire({
          title: '¡Éxito!',
          text: `La suscripción se ha actualizado correctamente. Su subscripción actual estará vigente hasta: ${formatDate(result.endDate, 'dd/MM/yyyy', 'en-Es')}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.router.navigate(['/subscription']);
      }
    }
    catch (error) {
      Swal.fire('Error', `${error}`, 'error');
    }
  }

  private loadSubscription(subscriptionId: string) {
    const subscription = this.subscriptionService.getSubscriptionById(subscriptionId);
    if (subscription) {
      this.customer = subscription.customer;
      this.subscriptionForm.patchValue({
        customerName: subscription.customer.name,
        customerEmail: subscription.customer.email,
        subscriptionPlan: this.subscriptionPlans.find(p => p.name === subscription.plan.name),
        paymentFrequency: subscription.paymentFrequency
      });
    }
  }

  private getPlans(): void {
    this.subscriptionPlans = this.planService.getPlans();
  }

  private isFormValid(): boolean {
    return this.subscriptionForm.valid && !!this.customer;
  }


  private createSubscriptionDto(): SubscriptionDTO {
    return {
      customer: {
        id: this.customer!.id,
        name: this.customer!.name,
        email: this.customer!.email
      },
      plan: this.subscriptionForm.get('subscriptionPlan')!.value,
      paymentFrequency: this.subscriptionForm.get('paymentFrequency')!.value
    } as SubscriptionDTO;
  }

}
