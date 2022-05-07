import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populater from "behavior/core/each/Populater";
import RefreshStrategy from "behavior/core/each/RefreshStrategy";
import ComponentTransitions from "component/ComponentTransitions";
import Nestable from "interface/ables/Nestable";
import SimpleMap from "interface/SimpleMap";
import { equals, requireNotNull } from "util/Utils";

abstract class AbstractRefreshStrategy implements RefreshStrategy {

	private element: HTMLElement;

	private populater: Populater;

	private idStrategy: IdStrategy;

	private state: EachState;

	private createFn: (item: any) => Nestable;

	constructor(element: HTMLElement, populater: Populater, idStrategy: IdStrategy, state: EachState, createFn: (item: any) => Nestable) {
		this.element = requireNotNull(element, "element");
		this.populater = requireNotNull(populater, "populater");
		this.idStrategy = requireNotNull(idStrategy, "idStrategy");
		this.state = requireNotNull(state, "state");
		this.createFn = requireNotNull(createFn, "createFn");
	}

	public abstract refresh(current: any[]): void;

	protected enrich(items: any[]): void {
		// tslint:disable-next-line
		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			if (!this.idStrategy.check(item)) {
				this.idStrategy.enrich(item, i);
			}
		}
	}

	protected extract(items: any[]): string[] {
		const result: string[] = [];

		// tslint:disable-next-line
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const id: string = this.idStrategy.extract(item);
			result.push(id);
		}

		return result;
	}

	protected idsDiffer(ids: string[]): boolean {
		return !equals(10, this.state.getIds(), ids);
	}

	protected rebuildMap(items: any[],components: Nestable[]): void {
		const newMap: SimpleMap<Nestable> = {};

		for (const item of items) {
			const id: string = this.idStrategy.extract(item);
			const component: Nestable = this.state.getMap()[id] ? this.state.getMap()[id] : this.createFn(item);
			newMap[id] = component;
			components.push(component);
			delete this.state.getMap()[id];
		}

		for (const key in this.state.getMap()) {
			if (this.state.getMap().hasOwnProperty(key)) {
				const component: Nestable = this.state.getMap()[key];
				component.tell(ComponentTransitions.UNMOUNT);
				delete this.state.getMap()[key];
			}
		}

		this.state.setMap(newMap);
	}

	protected getElement(): HTMLElement {
		return this.element;
	}

	protected getState(): EachState {
		return this.state;
	}

	protected getPopulater(): Populater {
		return this.populater;
	}

}

export default AbstractRefreshStrategy;