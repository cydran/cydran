import Behaviors from "behavior/Behaviors";
import Behavior from "behavior/Behavior";
import { requireNotNull } from 'util/Utils';
import { Context } from "context/Context";

class BehaviorsImpl implements Behaviors {

	private behaviors: Behavior<unknown, HTMLElement | Text, unknown>[];

	constructor() {
		this.behaviors = [];
	}

	public tell(name: string, payload?: unknown): void {
		for (const behavior of this.behaviors) {
			behavior.tell(name, payload);
		}
	}

	public message(channelName: string, messageName: string, payload?: unknown): void {
		for (const behavior of this.behaviors) {
			behavior.send(messageName, payload).onChannel(channelName).toSelf();
		}
	}

	public add(behavior: Behavior<unknown, HTMLElement | Text, unknown>): void {
		requireNotNull(behavior, "behavior");

		this.behaviors.push(behavior);
	}

	public isEmpty(): boolean {
		return this.behaviors.length === 0;
	}

	public isPopulated(): boolean {
		return !this.isEmpty();
	}

	public setContext(context: Context): void {
		this.tell("setContext", context);
	}

}

export default BehaviorsImpl;
