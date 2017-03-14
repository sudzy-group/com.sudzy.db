import { Collection } from "pouchable";
import { Item } from "../entities/Item";

/**
 * Represents the Items collection
 */
export class Items extends Collection<Item> {

    public getPrefix() {
        return "item";
    }

}
