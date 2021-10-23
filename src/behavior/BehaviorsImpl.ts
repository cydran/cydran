import Behaviors from "behavior/Behaviors";
import Behavior from "behavior/Behavior";
import { requireNotNull } from 'util/Utils';

class BehaviorsImpl implements Behaviors {

	private behaviors: Behavior<any, HTMLElement | Text, any>[];

	constructor() {
		this.behaviors = [];
	}

	public tell(name: string, payload?: any): void {
		for (const behavior of this.behaviors) {
			behavior.tell(name, payload);
		}
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		for (const behavior of this.behaviors) {
			behavior.message(channelName, messageName, payload);
		}
	}

	public add(behavior: Behavior<any, HTMLElement | Text, any>): void {
		requireNotNull(behavior, "behavior");

		this.behaviors.push(behavior);
	}

	public isEmpty(): boolean {
		return this.behaviors.length === 0;
	}

	public isPopulated(): boolean {
		return !this.isEmpty();
	}

}

export default BehaviorsImpl;
