import SimpleMap from "interface/SimpleMap";
import Listener from "message/Listener";
import { requireNotNull } from "util/Utils";

class ListenerImpl implements Listener {

	private targetThisFn: () => any;

	private channelName: string;

	private mappings: SimpleMap<((payload: any) => void)[]>;

	constructor(channelName: string, targetThisFn: () => any) {
		this.mappings = {};
		this.channelName = requireNotNull(channelName, "channelName");
		this.targetThisFn = requireNotNull(targetThisFn, "targetThisFn");
	}

	public receive(messageName: string, payload: any): void {
		const mappings: ((payload: any) => void)[] = this.mappings[messageName];

		if (!mappings) {
			return;
		}

		for (const mapping of mappings) {
			mapping.call(this.targetThisFn(), payload);
		}
	}

	public register(messageName: string, callback: (payload: any) => void): void {
		if (!this.mappings[messageName]) {
			this.mappings[messageName] = [];
		}

		this.mappings[messageName].push(callback);
	}

	public getChannelName(): string {
		return this.channelName;
	}

	public $dispose(): void {
		this.mappings = {};
		this.targetThisFn = null;
	}
}

export default ListenerImpl;
