import RefreshStrategy from 'behavior/core/each/RefreshStrategy';
import { removeChildElements } from "util/Utils";

class EmptyRefreshStrategy implements RefreshStrategy {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element;
	}

	public refresh(current: any[]): void {
		removeChildElements(this.element);

		// TODO - Implement
		throw new Error("Method not implemented.");
	}

}

export default EmptyRefreshStrategy;