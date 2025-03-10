import { Injectable } from "@angular/core";
import { CustomerRepository } from "../../infrastructure/repositories/customer.repository";
import { CustomerDTO } from "../dtos/customer.dto";

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private customerRepository: CustomerRepository) { }

    public getCustomerByEmail(email: string): CustomerDTO {
        const customer = this.customerRepository.getByEmail(email);
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email
        }
    }
}