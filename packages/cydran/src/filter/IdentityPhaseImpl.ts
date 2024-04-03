import Phase from "filter/Phase";

class IdentityPhaseImpl implements Phase {

	public process(items: any[]): any[] {
		return items;
	}

	public setCallback(callback: () => void): void {
		// Intentionally do nothing
	}

	public invalidate(): void {
		// Intentionally do nothing
	}

}

export default IdentityPhaseImpl;
