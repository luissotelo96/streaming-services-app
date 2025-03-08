import { Injectable } from "@angular/core";
import { CustomerRepository } from "../../infrastructure/repositories/customer-repository";
import { GetCustomerDTO } from "../dtos/get-customer-dto.model";

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private customerRepository: CustomerRepository) { }

    public getCustomerByEmail(email: string): GetCustomerDTO {
        const customer = this.customerRepository.getByEmail(email);
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email
        }
    }
}