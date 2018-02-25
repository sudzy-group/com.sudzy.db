import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a message 
 */
export class Message extends Entity {
	
	@EntityField({
        group: "default",
        name: "group_id",
        mandatory: true,
        description: "Group ID, customer's phone number",
        search_by: [ identity ] 
    })
    public group_id: string;

	@EntityField({
        group: "default",
        name: "group_name",
        mandatory: true,
        description: "Group name, customer's name"
    })
    public group_name: string;

	@EntityField({
        group: "default",
        name: "sender",
        mandatory: true,
        description: "Sender's mobile number"
    })
    public sender: string;

	@EntityField({
        group: "default",
        name: "body",
        mandatory: true,
        description: "Message body"
    })
    public body: string;

    @EntityField({
        group: "default",
        name: "is_me",
        mandatory: true,
        description: "Is me (business)"
    })
    public is_me: boolean;

    @EntityField({
        group: "unread",
        name: "is_unread",
        description: "Is message unread",
        search_by: [ identity ] 
    })
    public is_unread: boolean;
}