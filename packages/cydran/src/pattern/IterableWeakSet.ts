interface IterableWeakSet<R, M> {

	add(item: R, metadata?: M): void;

	remove(item: R): void;

	forEach(callback: (item: R, metadata: M) => void): void;

	clear(): void;

}

export default IterableWeakSet;
