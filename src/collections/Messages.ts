import { Collection } from "pouchable";
import { Message } from "../entities/Message";

const WEEK = 7*24*60*60*1000;

/**
 * Represents the Messages collection
 */
export class Messages extends Collection<Message> {

    public getPrefix() {
        return "msg";
    }

    /**
     * Find last messages from all group
     * @param skip 
     * @param limit 
     */
    public findLatest(skip, limit): Promise<Message[]> {
        let now = new Date().getTime();
        let previous = now - WEEK;
        let opt = { limit: limit * 2, descending: true }
        if (skip) {
            opt['skip'] = skip * 2;
        }
        return this.findByIds(previous.toString(), now.toString(), opt);
    }

    /**
     * Find all messages in a group
     * @param id 
     * @param skip 
     * @param limit 
     */
    public findByGroup(groupId, skip, limit): Promise<Message[]> {
        let now = new Date().getTime();
        let previous = now - WEEK;
        let opt = { limit: limit * 2, descending: true }
        if (skip) {
            opt['skip'] = skip * 2;
        }
        return this.find('group_id', groupId, opt);
    }    
}
