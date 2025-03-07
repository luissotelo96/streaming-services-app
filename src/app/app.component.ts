import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubscriptionComponent } from "./components/subscription/subscription.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SubscriptionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'streaming-services-app';
}
