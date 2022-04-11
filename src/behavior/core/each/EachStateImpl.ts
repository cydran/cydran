import Alternative from "behavior/core/each/Alternative";
import EachState from "behavior/core/each/EachState";
import DigestableSource from "behavior/DigestableSource";
import ComponentFactory from "component/ComponentFactory";
import ComponentTransitions from "component/ComponentTransitions";
import Nestable from "interface/ables/Nestable";
import SimpleMap from "interface/SimpleMap";
import ScopeImpl from "scope/ScopeImpl";

class EachStateImpl implements EachState {

	private map: SimpleMap<Nestable>;

	private ids: string[];

	private itemFactory: ComponentFactory;

	private empty: Nestable;

	private first: Nestable;

	private last: Nestable;

	private alternatives: Alternative[];

	private localScope: ScopeImpl;

	constructor() {
		this.ids = [];
		this.map = {};
		this.itemFactory = null;
		this.empty = null;
		this.first = null;
		this.last = null;
		this.alternatives = [];
		this.localScope = null;
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			sources.push(component);
		}

		if (this.first) {
			sources.push(this.first);
		}

		if (this.last) {
			sources.push(this.last);
		}

		if (this.empty) {
			sources.push(this.empty);
		}
	}

	public mount(): void {
		this.tellChildren(ComponentTransitions.MOUNT);
	}

	public unmount(): void {
		this.tellChildren(ComponentTransitions.UNMOUNT);
	}

	public tellChildren(name: string, payload?: any): void {
		if (this.empty) {
			this.empty.tell(name, payload);
		}

		if (this.first) {
			this.first.tell(name, payload);
		}

		if (this.last) {
			this.last.tell(name, payload);
		}

		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.tell(name, payload);
		}
	}

	public getItemFactory(): ComponentFactory {
		return this.itemFactory;
	}

	public setItemFactory(itemFactory: ComponentFactory): void {
		this.itemFactory = itemFactory;
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

	public getEmpty(): Nestable {
		return this.empty;
	}

	public setEmpty(empty: Nestable): void {
		this.empty = empty;
	}

	public getFirst(): Nestable {
		return this.first;
	}

	public setFirst(first: Nestable): void {
		this.first = first;
	}

	public getLast(): Nestable {
		return this.last;
	}

	public setLast(last: Nestable): void {
		this.last = last;
	}

	public getLocalScope(): ScopeImpl {
		return this.localScope;
	}

	public setLocalScope(localScope: ScopeImpl): void {
		this.localScope = localScope;
	}

	public addAlternative(alternative: Alternative): void {
		this.alternatives.push(alternative);
	}

	public findFactory(): ComponentFactory {
		let factory: ComponentFactory = this.itemFactory;

		if (this.alternatives.length > 0) {
			for (const alternative of this.alternatives) {
				if (alternative.test.test()) {
					factory = alternative.factory;
					break;
				}
			}
		}

		return factory;
	}

}

export default EachStateImpl;
