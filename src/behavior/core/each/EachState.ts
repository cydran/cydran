import DigestableSource from "behavior/DigestableSource";
import Nestable from "interface/ables/Nestable";
import SimpleMap from "interface/SimpleMap";
import Alternative from 'behavior/core/each/Alternative';
import ComponentFactory from "component/ComponentFactory";
import ScopeImpl from "scope/ScopeImpl";

interface EachState {

	getIds(): string[];

	setIds(ids: string[]): void;

	getMap(): SimpleMap<Nestable>;

	setMap(map: SimpleMap<Nestable>): void;

	getItemFactory(): ComponentFactory;

	setItemFactory(itemFactory: ComponentFactory): void;

	getEmpty(): Nestable;

	setEmpty(empty: Nestable): void;

	getFirst(): Nestable;

	setFirst(first: Nestable): void;

	getLast(): Nestable;

	setLast(last: Nestable): void;

	getLocalScope(): ScopeImpl;

	setLocalScope(localScope: ScopeImpl): void;

	addAlternative(alternative: Alternative): void;

	findFactory(): ComponentFactory;

	requestDigestionSources(sources: DigestableSource[]): void;

	tellChildren(name: string, payload?: any): void;

}

export default EachState;
