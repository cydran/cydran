interface PairedWeakMap<K extends Object, L extends Object, V extends Object> {

	set(firstKey: K, secondKey: L, value: V): void;

	get(firstKey: K, secondKey: L): V | undefined;

	delete(firstKey: K, secondKey: L): void;

	has(firstKey: K, secondKey: L): boolean;

	clear(): void;

}

export default PairedWeakMap;