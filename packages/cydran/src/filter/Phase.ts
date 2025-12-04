interface Phase {

	process(items: unknown[]): unknown[];

	invalidate(): void;

	setCallback(callback: () => void): void;

}

export default Phase;
