import { Injectable } from "@angular/core";
import { CustomerEntity } from "../entities/customer.entity";

@Injectable({
    providedIn: 'root',
})
export class CustomerRepository {
    private customers: CustomerEntity[] = [
        { id: "3f7f91eb-d2ed-4157-8b51-be6db8ecc969", name: "John Cifuentes", email: "johncifuentes@yopmail.com" },
        { id: "afeccac1-97a3-4eb6-9cb1-1f850d0a116f", name: "Fabián Sotelo", email: "fabiansotelo@yopmail.com" },
        { id: "aa2d06ee-0a40-466f-903d-917d7f7f7bbe", name: "Ligia Murillo", email: "ligiamurillo@yopmail.com" },
        { id: "bc6d2276-6147-4655-af97-1b131925a4b8", name: "Lina Maria", email: "linamaria@yopmail.com" },
    ];

    constructor() {
    }

    public getById(customerId: string): CustomerEntity {
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