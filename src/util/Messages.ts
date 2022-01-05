import { isDefined } from "util/Utils";
import { Consumer, Supplier } from 'interface/Predicate';
import Addable from "interface/ables/Addable";

const DEFAULT_PREFIX: string = "Errors";

class Messages implements Addable<string> {

	private prefix: string;

	private messages: string[];

	constructor(prefix?: string) {
		this.prefix = isDefined(prefix) ? prefix : DEFAULT_PREFIX;
		this.messages = [];
	}

	public add(message: string): void {
		if (!isDefined(message)) {
			return;
		}

		const trimmed: string = message.trim();

		if (trimmed.length > 0) {
			this.messages.push(trimmed);
		}
	}

	public addIf(condition: boolean, supplier: Supplier<string>): void {
		if (condition) {
			this.add(supplier());
		}
	}

	public getMessages(): string {
		return this.messages.length === 0 ? "" : this.prefix + ":\n\t- " + this.messages.join("\n\t- ") + "\n";
	}

	public clear(): void {
		this.messages = [];
	}

	public hasMessages(): boolean {
		return this.messages.length > 0;
	}

	public ifMessages(consumer: Consumer<string>): void {
		if (this.hasMessages()) {
			consumer(this.getMessages());
		}
	}

}

export default Messages;