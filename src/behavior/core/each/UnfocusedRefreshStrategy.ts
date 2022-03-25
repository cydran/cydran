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

	constructor(element: HTMLElement, populater: Populater, idStrategy: IdStrategy, state: EachState) {
		this.element = requireNotNull(element, "element");
		this.populater = requireNotNull(populater, "populater");
		this.idStrategy = requireNotNull(idStrategy, "idStrategy");
		this.state = requireNotNull(state, "state");
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
				const component: Nestable = this.state.getMap()[id] ? this.state.getMap()[id] : this.create(item);
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
				if (this.empty) {
					this.element.appendChild(this.empty.getEl());
				}
			} else {
				if (this.first) {
					this.populater.appendChild(this.first.getEl());
				}

				for (const component of components) {
					this.populater.appendChild(component.getEl());
				}

				if (this.last) {
					this.populater.appendChild(this.last.getEl());
				}

				this.populater.populate();
			}
		}

		this.state.setIds(newIds);
	}

}

export default UnfocusedRefreshStrategy;
