import RefreshStrategy from "behavior/core/each/RefreshStrategy";

class FocusedRefreshStrategy implements RefreshStrategy {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element;
	}

	public refresh(items: any[]): void {
		// TODO - Implement
	}

}

export default FocusedRefreshStrategy;
