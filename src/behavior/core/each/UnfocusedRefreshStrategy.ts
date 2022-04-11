import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populater from "behavior/core/each/Populater";
import RefreshStrategy from "behavior/core/each/RefreshStrategy";
import ComponentTransitions from "component/ComponentTransitions";
import Nestable from "interface/ables/Nestable";
import SimpleMap from "interface/SimpleMap";
import { equals, removeChildElements, requireNotNull } from "util/Utils";

class UnfocusedRefreshStrategy implements RefreshStrategy {

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

	public refresh(items: any[]): void {
		const newIds: string[] = [];

		// tslint:disable-next-line
		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			if (!this.idStrategy.check(item)) {
				this.idStrategy.enrich(item, i);
			}
		}

		// tslint:disable-next-line
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const id: string = this.idStrategy.extract(item);
			newIds.push(id);
		}

		if (!equals(10, this.state.getIds(), newIds)) {
			const newMap: SimpleMap<Nestable> = {};
			const components: Nestable[] = [];

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

			removeChildElements(this.element);

			if (components.length === 0) {
				if (this.state.getEmpty()) {
					this.element.appendChild(this.state.getEmpty().getEl());
				}
			} else {
				if (this.state.getFirst()) {
					this.populater.appendChild(this.state.getFirst().getEl());
				}

				for (const component of components) {
					this.populater.appendChild(component.getEl());
				}

				if (this.state.getLast()) {
					this.populater.appendChild(this.state.getLast().getEl());
				}

				this.populater.populate();
			}
		}

		this.state.setIds(newIds);
	}

}

export default UnfocusedRefreshStrategy;
