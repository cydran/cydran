import SimpleMap from "interface/SimpleMap";
import Listener from "message/Listener";
import { requireNotNull } from "util/Utils";

class ListenerImpl implements Listener {
	private contextFn: () => any;

	private channelName: string;

	private mappings: SimpleMap<((payload: any) => void)[]>;

	constructor(channelName: string, contextFn: () => any) {
		this.mappings = {};
		this.channelName = requireNotNull(channelName, "channelName");
		this.contextFn = requireNotNull(contextFn, "contextFn");
	}

	public receive(messageName: string, payload: any): void {
		const mappings: ((payload: any) => void)[] = this.mappings[messageName];

		if (!mappings) {
			return;
		}

		for (const mapping of mappings) {
			mapping.call(this.contextFn(), payload);
		}
	}

	public register(messageName: string, fn: (payload: any) => void): void {
		if (!this.mappings[messageName]) {
			this.mappings[messageName] = [];
		}

		this.mappings[messageName].push(fn);
	}

	public getChannelName(): string {
		return this.channelName;
	}

	public $dispose(): void {
		this.mappings = {};
		this.contextFn = null;
	}
}

export default ListenerImpl;
