import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { CreateSubscriptionComponent } from './components/create-subscription/create-subscription.component';

const routes: Routes = [
    { path: 'subscription', component: SubscriptionComponent },
    { path: 'create-subscription', component: CreateSubscriptionComponent },
    { path: 'create-subscription/:id', component: CreateSubscriptionComponent },
    { path: '', redirectTo: '/subscription', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }