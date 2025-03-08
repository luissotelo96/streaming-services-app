import { Injectable } from "@angular/core";
import { CustomerEntity } from "../entities/customer-entity";

@Injectable({
    providedIn: 'root',
})
export class CustomerRepository {
    private customers: CustomerEntity[] = [
        { id: 1, name: "John Cifuentes", email: "johncifuentes@yopmail.com" },
        { id: 2, name: "Fabián Sotelo", email: "fabiansotleo@yopmail.com" },
    ];

    constructor() {
    }

    public getById(customerId: number): CustomerEntity {
        const customer = this.customers.find(c => c.id === customerId);
        if (customer === undefined) {
            throw new Error(`Cliente con id ${customerId} no fue encontrado.`)
        }
        return customer;
    }

    public getByEmail(email: string): CustomerEntity {
        const customer = this.customers.find(c => c.email === email);
        if (customer === undefined) {
            throw new Error(`Cliente con email ${email} no fue encontrado.`)
        }
        return customer;
    }
}