import { Consumer, Supplier } from "interface/Predicate";

interface AdvancedMap<T> {

	each(consumer: Consumer<T>): void;

	has(key: string): boolean;

	lacks(key: string): boolean;

	clear(): void;

	put(key: string, value: T): void;

	get(key: string): T;

	computeIfAbsent(key: string, supplier: Supplier<T>): T;

}

export default AdvancedMap;
