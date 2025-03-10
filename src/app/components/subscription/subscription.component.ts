import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionService } from '../../core/application/services/subscription.service';
import { GetSubscriptionDTO } from '../../core/application/dtos/get-subscription.dto';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'plan', 'paymentFrequency', 'startDate', 'endDate', 'monthlyCost', 'totalCost', 'customerName', 'customerEmail', 'status', 'partialRefund','options'];
  dataSource = new MatTableDataSource<GetSubscriptionDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  subscriptions: GetSubscriptionDTO[] = [];

  constructor(private subscriptionService: SubscriptionService, private router: Router) {

  }
  ngOnInit(): void {
    this.loadSubscriptions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Ítems por página";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToCreateSubscription() {
    this.router.navigate(['/create-subscription']);
  }

  goToUpdateSubscription(subscriptionId: string) {
    this.router.navigate(['/create-subscription', subscriptionId]);
  }

  private loadSubscriptions() {
    this.subscriptions = this.subscriptionService.getAll();
    this.dataSource.data = this.subscriptions;
  }

  cancelSubscription(subscriptionId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cancelar esta suscripción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const canceledSubscription = this.subscriptionService.cancelSubscription(subscriptionId);
          if (canceledSubscription.endDate) {
            Swal.fire({
              title: '¡Éxito!',
              text: `La suscripción se ha cancelado correctamente. Su suscripción actual estará vigente hasta: ${formatDate(canceledSubscription.endDate, 'dd/MM/yyyy', 'en-Es')}`,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.loadSubscriptions();
          }
        } catch (error) {
          Swal.fire('Error', `${error}`, 'error');
        }
      }
    });
  }
}