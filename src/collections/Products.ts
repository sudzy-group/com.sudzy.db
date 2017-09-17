import { Collection } from "pouchable";
import { Product } from "../entities/Product";

/**
 * Represents the Products collection
 */
export class Products extends Collection<Product> {

    public getPrefix() {
        return "prod";
    }

}
