import EachState from "behavior/core/each/EachState";
import RefreshStrategy from 'behavior/core/each/RefreshStrategy';
import ComponentTransitions from "component/ComponentTransitions";
import { Nestable } from "interface/ComponentInterfaces";
import { removeChildElements } from "util/Utils";

class EmptyRefreshStrategy implements RefreshStrategy {

	private element: HTMLElement;

	private state: EachState;

	constructor(element: HTMLElement, state: EachState) {
		this.element = element;
		this.state = state;
	}

	public refresh(current: any[]): void {
		for (const key in this.state.getMap()) {
			if (this.state.getMap().hasOwnProperty(key)) {
				const component: Nestable = this.state.getMap()[key];
				component.$c().tell(ComponentTransitions.UNMOUNT);
			}
		}

		this.state.setIds([]);
		this.state.setMap({});

		removeChildElements(this.element);

		if (this.state.getEmpty()) {
			this.element.appendChild(this.state.getEmpty().$c().getEl());
		}
	}

}

export default EmptyRefreshStrategy;