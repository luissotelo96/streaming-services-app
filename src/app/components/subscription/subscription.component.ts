import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionService } from '../../core/application/services/subscription.service';
import { GetSubscriptionDTO } from '../../core/application/dtos/get-subscription-dto.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['plan', 'paymentFrequency', 'startDate', 'endDate', 'finalCost', 'customerName', 'customerEmail', 'options'];
  dataSource = new MatTableDataSource<GetSubscriptionDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private subscriptionService: SubscriptionService, private router: Router) {

  }
  ngOnInit(): void {
    const subscriptions = this.subscriptionService.getActiveSubscriptions();
    this.dataSource.data = subscriptions;
    console.log(subscriptions);
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

  goToUpdateSubscription() {
    this.router.navigate(['']);
  }

  cancelSubscription() {
    this.router.navigate(['']);
  }
}