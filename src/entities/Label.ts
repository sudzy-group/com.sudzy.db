import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a Label entity
 */
export class Label extends Entity {

	@EntityField({
		group: "default",
		name: "label",
		mandatory: true,
		search_by: [identity],
		description: "Label's readable number"
	})
	public label: string;

	@EntityField({
		group: "desc",
		name: "isbn",
		description: "isbn"
	})
	public isbn: string;

	@EntityField({
		group: "desc",
		name: "type",
		description: "Type"
	})
	public type: string;

	@EntityField({
		group: "desc",
		name: "name",
		description: "Item name"
	})
	public name: string;

	@EntityField({
		group: "desc",
		name: "quantity",
		description: "Quantity of item"
	})
	public quantity: number;

	@EntityField({
		group: "desc",
		name: "price",
		description: "Total price"
	})
	public price: number;

	@EntityField({
		group: "desc",
		name: "is_manual_pricing",
		description: "User selected manual pricing"
	})
	public is_manual_pricing: boolean;

	@EntityField({
		group: "desc",
		name: "notes",
		description: "Specific notes about this item"
	})
	public notes: string[];

	@EntityField({
		group: "extra",
		name: "extra",
		description: "extra description and upcharges for item"
	})
	public extra: any[];

	@EntityField({
		group: "order",
		name: "order_id",
		description: "Current order id"
	})
	public order_id: string;
}