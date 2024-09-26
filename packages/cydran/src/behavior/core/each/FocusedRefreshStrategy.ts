import AbstractRefreshStrategy from "behavior/core/each/AbstractRefreshStrategy";
import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populator from "behavior/core/each/Populator";
import DomUtils from "dom/DomUtils";
import { Nestable } from "interface/ComponentInterfaces";
import { isDefined } from 'util/Utils';

class FocusedRefreshStrategy extends AbstractRefreshStrategy {

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

		const elements: HTMLElement[] = [];

		if (this.getState().getFirst()) {
			elements.push(this.getState().getFirst().$c().getEl());
		}

		for (const component of components) {
			elements.push(component.$c().getEl());
		}

		if (this.getState().getLast()) {
			elements.push(this.getState().getLast().$c().getEl());
		}

		const beforeElements: HTMLElement[] = [];
		const afterElements: HTMLElement[] = [];
		let focusedElement: HTMLElement = null;

		while (elements.length > 0) {
			const element: HTMLElement = elements.shift();

			if (DomUtils.elementIsFocused(element)) {
				focusedElement = element;
				continue;
			}

			(isDefined(focusedElement) ? afterElements : beforeElements).push(element);
		}

		const parent: HTMLElement = this.getElement();

		while (beforeElements.length > 0) {
			const element: HTMLElement = beforeElements.shift();
			parent.insertBefore(element, focusedElement);
		}

		while (afterElements.length > 0) {
			const element: HTMLElement = afterElements.pop();
			parent.insertBefore(element, focusedElement.nextSibling);
		}

		this.getState().setIds(newIds);
	}

}

export default FocusedRefreshStrategy;
