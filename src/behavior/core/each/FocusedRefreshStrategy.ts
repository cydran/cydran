import AbstractRefreshStrategy from "behavior/core/each/AbstractRefreshStrategy";
import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populater from "behavior/core/each/Populater";
import Nestable from "interface/ables/Nestable";
import { removeChildElements } from "util/Utils";

class FocusedRefreshStrategy extends AbstractRefreshStrategy {

	constructor(element: HTMLElement, populater: Populater, idStrategy: IdStrategy, state: EachState, createFn: (item: any) => Nestable) {
		super(element, populater, idStrategy, state, createFn);
	}

	public refresh(items: any[]): void {
		this.enrich(items);
		const newIds: string[] = this.extract(items);

		if (this.idsDiffer(newIds)) {
			const components: Nestable[] = [];
			this.rebuildMap(items, components);

			removeChildElements(this.element);

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

		this.state.setIds(newIds);
	}

}

export default FocusedRefreshStrategy;
