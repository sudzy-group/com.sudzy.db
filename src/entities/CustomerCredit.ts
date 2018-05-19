import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a Customer Credit entity
 */
export class CustomerCredit extends Entity {

	@EntityField({
        group: "default",
        name: "customer_id",
        mandatory: true,
        description: "Customer id",
        search_by: [ identity ] 
    })
    public customer_id: string;

	@EntityField({
        group: "default",
        name: "original",
        mandatory: true,
        description: "Original credit"
    })
    public original: number;

    @EntityField({
        group: "default",
        name: "reason",
        mandatory: true,
        description: "Reason: 1-Missing item 2-Damaged 3-Gift card 4-Promotion 5-Billing error"
    })
    public reason: number;

    @EntityField({
        group: "default",
        name: "description",
        mandatory: true,
        description: "Description of this credit"
    })
    public description: string;
    
    @EntityField({
        group: "default",
        name: "employee_id",
        mandatory: true,
        description: "Employee id that created this credit"
    })
    public employee_id: string;

    @EntityField({
        group: "default",
        name: "payment_method",
        mandatory: true,
        description: "Payment description of this credit"
    })
    public payment_method: string;    

    @EntityField({
        group: "default",
        name: "payment_id",
        mandatory: true,
        description: "Payment id of this credit (usually the transaction id)"
    })
    public payment_id: string;    

    @EntityField({
        group: "balance",
        name: "balance",
        description: "Balance of the credit"
    })
    public balance: number; 

    /**
     * Calculates the balance of this credit
     */
    public getBalance() {
        if (this.balance === 0) return 0;
        return this.balance || this.original;
    }
}