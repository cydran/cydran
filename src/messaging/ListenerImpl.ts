import Listener from "./Listener";

class ListenerImpl implements Listener {

	private context: any;

	private channelName;

	private mappings: {
		[messageName: string]: Function[];
	};

	constructor(channelName: string, context: any) {
		this.mappings = {};
		this.channelName = channelName;
		this.context = context;
	}

	public receive(messageName: string, payload: any): void {
		let mappings: Function[] = this.mappings[messageName];

		if (!mappings) {
			return;
		}

		for (let i = 0;i < mappings.length;i++) {
			mappings[i].call(this.context, payload);
		}
	}

	public register(messageName: string, fn: Function): void {
		if (!this.mappings[messageName]) {
			this.mappings[messageName] = [];
		}

		this.mappings[messageName].push(fn);
	}

	public getChannelName(): string {
		return this.channelName;
	}

	public dispose(): void {
		this.mappings = {};
		this.context = null;
	}

}

export default ListenerImpl;
