import { Collection } from "pouchable";
import { Purchase } from "../entities/Purchase";

/**
 * Represents the Purchases collection
 */
export class Purchases extends Collection<Purchase> {

    public getPrefix() {
        return "purch";
    }

}
