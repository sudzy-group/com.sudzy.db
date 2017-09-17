import { Entity, EntityField } from "pouchable";
import { lengthGreater1 } from "../validators/lengthGreater1";
import { identity } from "lodash";
/**
 * Represent a product entity
 */
export class Product extends Entity { 

    @EntityField({
        group: "default",
        mandatory: true,
        name: "name",
        description: "Product's name",
        validate: lengthGreater1
    })
    public name: string;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "sku",
        search_by: [identity],
        description: "Product's SKU"
    })
    public sku: string;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "image",
        description: "Product's image"
    })
    public image: string;

    @EntityField({
        group: "price",
        name: "price",
        description: "Product's price"
    })
    public price: number;

    @EntityField({
        group: "goods_in_stock",
        name: "goods_in_stock",
        description: "Goods in stock"
    })
    public goods_in_stock: number;

}
