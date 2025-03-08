import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { CreateSubscriptionComponent } from './components/create-subscription/create-subscription.component';

@NgModule({
  declarations: [
    AppComponent,
    SubscriptionComponent,
    CreateSubscriptionComponent
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
