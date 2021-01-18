interface Phase {
	process(items: any[]): any[];

	invalidate(): void;

	setCallback(callback: () => void): void;
}

export default Phase;
