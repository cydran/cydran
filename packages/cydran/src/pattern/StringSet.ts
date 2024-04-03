interface StringSet {

	add(value: string): void;

	remove(value: string): void;

	contains(value: string): boolean;

	clear(): void;

	size(): number;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default StringSet;
