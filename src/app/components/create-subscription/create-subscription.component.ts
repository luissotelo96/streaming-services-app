import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { SubscriptionPlanDTO } from '../../core/application/dtos/subscription-plan-dto.enum';
import { PaymentFrequencyDTO } from '../../core/application/dtos/payment-frequency-dto.model';
import { SubscriptionService } from '../../core/application/services/subscription.service';
import { CustomerService } from '../../core/application/services/customer.service';
import { GetCustomerDTO } from '../../core/application/dtos/get-customer-dto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrl: './create-subscription.component.scss'
})
export class CreateSubscriptionComponent implements OnInit {
  subscriptionForm!: FormGroup;
  subscriptionPlans: SubscriptionPlanDTO[] = [
    { name: "Basic", monthlyCost: 15000, yearlyDiscount: 10 },
    { name: "Standard", monthlyCost: 20000, yearlyDiscount: 15 },
    { name: "Premium", monthlyCost: 30000, yearlyDiscount: 20 },
  ];
  paymentFrequencies: PaymentFrequencyDTO[] = [
    PaymentFrequencyDTO.Monthly,
    PaymentFrequencyDTO.Yearly
  ];
  customer!: GetCustomerDTO;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private customerService: CustomerService
  ) {
    this.subscriptionForm = this.formBuilder.group({
      customerEmail: ["", [Validators.required, Validators.email]],
      subscriptionPlan: [null, [Validators.required]],
      paymentFrequency: ["", [Validators.required]]
    });
  }

  ngOnInit() {

  }

  searchCustomer(): void {
    const email = this.subscriptionForm.get('numRazonSocial')?.value;
    if (!email) {
      Swal.fire('Error', 'Por favor, ingrese un email válido.', 'error');
      return;
    }

    this.customer = this.customerService.getCustomerByEmail(email);
    // this.clientService.getClientByEmail(email).subscribe(
    //   (client) => {
    //     if (client) {
    //       this.clientData = client;
    //     } else {
    //       this.clientData = null;
    //       Swal.fire('No encontrado', 'No se encontró ningún cliente con ese email.', 'warning');
    //     }
    //   },
    //   (error) => {
    //     console.error('Error al buscar cliente:', error);
    //     Swal.fire('Error', 'Hubo un problema al buscar el cliente.', 'error');
    //   }
    // );
  }

  goBackToSubscription(): void {
    this.router.navigate(['/subscription']);
  }

  selectPlan(plan: SubscriptionPlanDTO): void {
    this.subscriptionForm.patchValue({ subscriptionPlan: plan });
  }

  createSubscription(): void {

  }
}
