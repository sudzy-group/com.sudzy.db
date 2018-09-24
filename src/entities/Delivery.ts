import { Entity, EntityField } from "pouchable";
import { identity } from "lodash";
import { lengthGreater1 } from "../validators/lengthGreater1";
import { noWhitespace } from "../validators/noWhitespace";

/**
 * Represent a Delivery entity
 */
export class Delivery extends Entity {
  @EntityField({
    group: "default",
    name: "customer_id",
    mandatory: true,
    description: "Customer id"
  })
  public customer_id: string;

  @EntityField({
    group: "default",
    name: "is_pickup",
    mandatory: true,
    description: "Whether delivery is pickup"
  })
  public is_pickup: boolean;

  @EntityField({
    group: "default",
    name: "delivery_time",
    mandatory: true,
    description: "Delivery time",
    search_by: [identity]
  })
  public delivery_time: string;

  @EntityField({
    group: "person",
    name: "delivery_person",
    validate: lengthGreater1,
    description: "Delivery person"
  })
  public delivery_person: string;

  @EntityField({
    group: "notes",
    name: "delivery_notes",
    description: "Delivery notes"
  })
  public delivery_notes: string;

  @EntityField({
    group: "status",
    name: "is_confirmed",
    search_by: [identity],
    description: "Whether store confirmed delivery"
  })
  public is_confirmed: boolean;

  @EntityField({
    group: "status",
    name: "is_canceled",
    description: "Whether delivery is canceled"
  })
  public is_canceled: boolean;

  @EntityField({
    group: "express",
    name: "express_id",
    validate: noWhitespace,
    description: "Express id"
  })
  public express_id: string;

  @EntityField({
    group: "external",
    name: "external_id",
    search_by: [identity],
    description: "Order id (eg. dcom or sudzy)"
  })
  public external_id: string;

  @EntityField({
    group: "doorman",
    name: "doorman_first_name",
    description: "Doorman's first name"
  })
  public doorman_first_name: string;

  @EntityField({
    group: "doorman",
    name: "doorman_last_name",
    description: "Doorman's last name"
  })
  public doorman_last_name: string;

  @EntityField({
    group: "doorman",
    name: "doorman_signature",
    description: "Doorman's signature url"
  })
  public doorman_signature: string;

  @EntityField({
    group: "doorman",
    name: "doorman_signed_at",
    description: "Doorman's signed at"
  })
  public doorman_signed_at: number;

  @EntityField({
    group: "orders_list",
    name: "orders",
    description: "Orders"
  })
  public orders: string[];

  @EntityField({
    group: "more",
    name: "priority",
    description: "Priority of the delivery"
  })
  public priority: number;
}
