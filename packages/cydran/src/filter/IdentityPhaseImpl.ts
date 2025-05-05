import Phase from "filter/Phase";

class IdentityPhaseImpl implements Phase {

	public process(items: unknown[]): unknown[] {
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
