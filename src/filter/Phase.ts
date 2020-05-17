interface Phase {

	process(items: any[]): any[];

	setCallback(callback: () => void): void;

}

export default Phase;
