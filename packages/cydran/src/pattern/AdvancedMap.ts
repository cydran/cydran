import { Consumer } from "interface/Predicate";

interface AdvancedMap<T> {

	each(consumer: Consumer<T>): void;

	has(key: string): boolean;

	lacks(key: string): boolean;

	clear(): void;

	put(key: string, value: T): void;

	get(key: string): T;

	keys(): string[];

	remove(key: string): void;

	computeIfAbsent(key: string, supplier: (key: string) => T): T;

}

export default AdvancedMap;
