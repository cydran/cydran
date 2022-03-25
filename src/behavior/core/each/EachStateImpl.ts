import EachState from "behavior/core/each/EachState";
import Nestable from "interface/ables/Nestable";
import SimpleMap from "interface/SimpleMap";

class EachStateImpl implements EachState {

	private map: SimpleMap<Nestable>;

	private ids: string[];

	constructor() {
		this.ids = [];
		this.map = {};
	}

	public getIds(): string[] {
		return this.ids;
	}

	public setIds(ids: string[]): void {
		this.ids = ids;
	}

	public getMap(): SimpleMap<Nestable> {
		return this.map;
	}

	public setMap(map: SimpleMap<Nestable>): void {
		this.map = map;
	}

}

export default EachStateImpl;
