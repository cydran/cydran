import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import { isDefined, removeFromArray, requireNotNull } from "util/Utils";
import PairedWeakMap from 'pattern/PairedWeakMap';
import PairedWeakMapImpl from 'pattern/PairedWeakMapImpl';

type SupportData<M> = {
	metadata: M;
	finalizer: Function;
};

type Pair<I extends Object, J extends Object> = {
	first: I;
	second: J;
}

class RefPair<I extends Object, J extends Object> {

	private firstRef: WeakRef<I>;

	private secondRef: WeakRef<J>;

	constructor(public first: I, public second: J) {
		requireNotNull(first, "first");
		requireNotNull(second, "second");

		this.firstRef = new WeakRef(first);
		this.secondRef = new WeakRef(second);
	}

	public deref(): Pair<I, J> | undefined {
		const currentFirst: I | undefined = this.firstRef.deref();
		const currentSecond: J | undefined = this.secondRef.deref();

		return currentFirst !== undefined && currentSecond !== undefined ? { first: currentFirst, second: currentSecond } : undefined;
	}

}

type Finalizer<M> = (metadata: M) => void;

type RemovalPredicate<I, J> = (ref: RefPair<I, J>) => boolean;

function createRemovalPredicate<I extends Object, J extends Object>(first: I, second: J): RemovalPredicate<I, J> {
	return (ref) => {
		const current: Pair<I, J> = ref.deref();

		return isDefined(current) && current.first === first && current.second === second;
	}
};

class GarbageCollectablePairedSetImpl<I extends Object, J extends Object, M extends Object> implements GarbageCollectablePairedSet<I, J, M> {

	private items: RefPair<I, J>[];

	private supportDatas: PairedWeakMap<I, J, SupportData<M>>;

	private finalizationRegistry: FinalizationRegistry<SupportData<M>>;

	constructor() {
		this.items = [];
		this.supportDatas = new PairedWeakMapImpl<I, J, SupportData<M>>();
		this.finalizationRegistry = new FinalizationRegistry((supportData: SupportData<M>) => {
			if (isDefined(supportData.finalizer)) {
				supportData.finalizer(supportData.metadata);
			}
		});
	}

	public add(firstItem: I, secondItem: J, metadata: M = {} as M, finalizer?: Finalizer<M>): void {
		requireNotNull(firstItem, "firstItem");
		requireNotNull(secondItem, "secondItem");
		this.remove(firstItem, secondItem);
		this.prune();
		this.items.push(new RefPair<I,J>(firstItem, secondItem));
		const supportData: SupportData<M> = {
			metadata: metadata,
			finalizer: finalizer 
		};

		// TODO - Handle both I and J objects
		this.supportDatas.set(firstItem, secondItem, supportData);
		this.finalizationRegistry.register(firstItem, supportData);
		this.finalizationRegistry.register(secondItem, supportData);
	}

	public remove(firstItem: I, secondItem: J): void {
		this.prune();

		const removableItems: RefPair<I, J>[] = this.items.filter(createRemovalPredicate(firstItem, secondItem));

		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}

	public forEach(callback: (firstItem: I, secondItem: J, metadata: M) => void): void {
		this.prune();

		for (const ref of this.items) {
			const item: Pair<I,J> = ref.deref();
			const supportData: SupportData<M>  = this.supportDatas.get(item.first, item.second);

			if (isDefined(item)) {
				callback(item.first, item.second, supportData.metadata);
			}
		}
	}

	public clear(): void {
		this.items = [];
		this.supportDatas.clear();
	}

	public size(): number {
		return this.items.length;
	}

	public isEmpty(): boolean {
		return this.items.length === 0;
	}

	public isPopulated(): boolean {
		return this.items.length > 0;
	}

	private prune(): void {
		const removableItems: RefPair<I, J>[] = this.items.filter((i) => !isDefined(i.deref()));

		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}

}

export default GarbageCollectablePairedSetImpl;