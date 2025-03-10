import { Injectable } from "@angular/core";
import { EventDTO } from "../dto/event.dto";

@Injectable({
    providedIn: 'root',
})
export class SubscriptionEventService {
    private eventsMessage: EventDTO[] = [];

    public sendCanceledEventMessage(event: EventDTO): void {
        this.eventsMessage.push(event);
    }
};