interface PairedWeakMap<K extends object, L extends object, V extends object> {

	set(firstKey: K, secondKey: L, value: V): void;

	get(firstKey: K, secondKey: L): V | undefined;

	delete(firstKey: K, secondKey: L): void;

	has(firstKey: K, secondKey: L): boolean;

	clear(): void;

}

export default PairedWeakMap;