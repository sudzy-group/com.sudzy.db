import { Collection } from "pouchable";
import { Label } from "../entities/Label";

/**
 * Represents the Labels collection such as Heat Seal Labels
 */
export class Labels extends Collection<Label> {
    
	public getPrefix() {
		return "lbl";
	}

	public findByLabel(label: string, options?): Promise<Label[]> {
		return this.find("label", label, options);
	}
}
