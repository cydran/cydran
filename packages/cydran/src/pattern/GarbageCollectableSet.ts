type Finalizer<M> = (metadata: M) => void;

interface GarbageCollectableSet<I, M> {

	add(item: I, metadata?: M, finalizer?: Finalizer<M>): void;

	remove(item: I): void;

	forEach(callback: (item: I, metadata: M) => void): void;

	clear(): void;

	size(): number;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default GarbageCollectableSet;
