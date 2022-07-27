import AbstractRefreshStrategy from "behavior/core/each/AbstractRefreshStrategy";
import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populater from "behavior/core/each/Populater";
import Dom from "dom/Dom";
import { Nestable } from "interface/ComponentInterfaces";
import { isDefined, requireNotNull } from 'util/Utils';

class FocusedRefreshStrategy extends AbstractRefreshStrategy {

	private dom: Dom;

	constructor(element: HTMLElement, populater: Populater, idStrategy: IdStrategy, state: EachState, createFn: (item: any) => Nestable, dom: Dom) {
		super(element, populater, idStrategy, state, createFn);
		this.dom = requireNotNull(dom, "dom");
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

			if (this.dom.elementIsFocused(element)) {
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
