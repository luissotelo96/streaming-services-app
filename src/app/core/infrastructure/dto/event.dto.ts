export interface EventDTO {
    header: EventHeaderDTO;
    body: EventBodyDTO;
}

export interface EventHeaderDTO {
    correlatonId: string;
    user: string;
    source: string;
}

export interface EventBodyDTO {
    subscriptionId: string;
    endDate: Date;
}