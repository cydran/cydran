type Finalizer<M> = (metadata: M) => void;

interface GarbageCollectablePairedSet<I, J, M> {

	add(firstItem: I, secondItem: J, metadata?: M, finalizer?: Finalizer<M>): void;

	remove(firstItem: I, secondItem: J): void;

	forEach(callback: (firstItem: I, secondItem: J, metadata: M) => void): void;

	clear(): void;

	size(): number;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default GarbageCollectablePairedSet;
