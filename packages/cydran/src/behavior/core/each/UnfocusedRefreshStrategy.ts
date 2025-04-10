import AbstractRefreshStrategy from "behavior/core/each/AbstractRefreshStrategy";
import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populator from "behavior/core/each/Populator";
import { Nestable } from "context/Context";
import { removeChildElements } from "util/Utils";

class UnfocusedRefreshStrategy extends AbstractRefreshStrategy {

	constructor(element: HTMLElement, populator: Populator, idStrategy: IdStrategy, state: EachState, createFn: (item: any) => Nestable) {
		super(element, populator, idStrategy, state, createFn);
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
			this.getPopulator().appendChild(this.getState().getFirst().$c().getEl());
		}

		for (const component of components) {
			this.getPopulator().appendChild(component.$c().getEl());
		}

		if (this.getState().getLast()) {
			this.getPopulator().appendChild(this.getState().getLast().$c().getEl());
		}

		this.getPopulator().populate();
		this.getState().setIds(newIds);
	}

}

export default UnfocusedRefreshStrategy;
