import AbstractRefreshStrategy from "behavior/core/each/AbstractRefreshStrategy";
import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populater from "behavior/core/each/Populater";
import { Nestable } from "interface/ComponentInterfaces";
import { removeChildElements } from "util/Utils";

class UnfocusedRefreshStrategy extends AbstractRefreshStrategy {

	constructor(element: HTMLElement, populater: Populater, idStrategy: IdStrategy, state: EachState, createFn: (item: any) => Nestable) {
		super(element, populater, idStrategy, state, createFn);
	}

	public refresh(items: any[]): void {
		this.enrich(items);
		const newIds: string[] = this.extract(items);

		if (this.idsSame(newIds)) {
			this.getState().setIds(newIds);
			return;
		}

		const components: Nestable[] = [];
		this.rebuildMap(items, components);
		removeChildElements(this.getElement());

		if (this.getState().getFirst()) {
			this.getPopulater().appendChild(this.getState().getFirst().$c().getEl());
		}

		for (const component of components) {
			this.getPopulater().appendChild(component.$c().getEl());
		}

		if (this.getState().getLast()) {
			this.getPopulater().appendChild(this.getState().getLast().$c().getEl());
		}

		this.getPopulater().populate();
		this.getState().setIds(newIds);
	}

}

export default UnfocusedRefreshStrategy;
