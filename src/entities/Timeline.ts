import { Entity, EntityField } from "pouchable";
import { identity } from "lodash";

/**
 * Represent an event in the timeline
 */
export class Timeline extends Entity {

  @EntityField({
    group: "default",
    name: "employee_id",
    mandatory: true,
    description: "Employee ID",
  })
  public employee_id: string;

  @EntityField({
    group: "default",
    name: "operation",
    mandatory: true,
    description: "Operation code"
  })
  public operation: number;

  @EntityField({
    group: "default",
    name: "order_id",
    mandatory: true,
    description: "Order id related to the operation",
    search_by: [identity]
  })
  public order_id: string;

  @EntityField({
    group: "default",
    name: "text",
    mandatory: true,
    description: "Text of the event"
  })
  public text: string;
}
