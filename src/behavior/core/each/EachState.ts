import Nestable from "interface/ables/Nestable";
import SimpleMap from "interface/SimpleMap";

interface EachState {

	getIds(): string[];

	setIds(ids: string[]): void;

	getMap(): SimpleMap<Nestable>;

	setMap(map: SimpleMap<Nestable>): void;

}

export default EachState;
