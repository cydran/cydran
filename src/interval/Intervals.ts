interface Intervals {

	add(callback: () => void, delay?: number): void;

	clear(): void;

	enable(): void;

	disable(): void;

}

export default Intervals;