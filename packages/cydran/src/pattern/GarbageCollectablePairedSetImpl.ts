import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import { isDefined, removeFromArray, requireNotNull } from "util/Utils";
import PairedWeakMap from 'pattern/PairedWeakMap';
import PairedWeakMapImpl from 'pattern/PairedWeakMapImpl';
import Pair from "pattern/Pair";
import RefPair from "pattern/RefPair";

type SupportData<M extends object> = {
	metadata: M;
	finalizer: Finalizer<M>;
};

type Finalizer<M> = (metadata: M) => void;

type RemovalPredicate<I extends object, J extends object> = (ref: RefPair<I, J>) => boolean;

function createRemovalPredicate<I extends object, J extends object>(first: I, second: J): RemovalPredicate<I, J> {
	return (ref) => {
		const current: Pair<I, J> = ref.deref() as Pair<I, J>;

		return isDefined(current) && current.first === first && current.second === second;
	}
};

class GarbageCollectablePairedSetImpl<I extends object, J extends object, M extends object> implements GarbageCollectablePairedSet<I, J, M> {

	private items: RefPair<I, J>[];

	private supportDatas: PairedWeakMap<I, J, SupportData<M>>;

	private finalizationRegistry: FinalizationRegistry<SupportData<M>>;

	constructor() {
		this.items = [];
		this.supportDatas = new PairedWeakMapImpl<I, J, SupportData<M>>();
		this.finalizationRegistry = new FinalizationRegistry((supportData: SupportData<M>) => {
			if (isDefined(supportData.finalizer)) {
				const finalizer: Finalizer<M> = isDefined(supportData.finalizer) ? supportData.finalizer as Finalizer<M> : null as unknown as Finalizer<M>;
				
				if (isDefined(finalizer)) {
					const metadata: M | undefined = supportData.metadata;
					
					finalizer(metadata as M);
				}
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
			finalizer: finalizer as Finalizer<M>
		};

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
			const item: Pair<I,J> = ref.deref() as Pair<I, J>;
			const supportData: SupportData<M>  = this.supportDatas.get(item.first, item.second) as SupportData<M>;

			if (isDefined(item)) {
				callback(item.first, item.second, supportData.metadata as M);
			}
		}
	}

	public clear(): void {
		this.items = [];
		this.supportDatas.clear();
	}

	public size(): number {
		this.prune();
		return this.items.length;
	}

	public isEmpty(): boolean {
		return this.size() === 0;
	}

	public isPopulated(): boolean {
		return this.size() > 0;
	}

	private prune(): void {
		const removableItems: RefPair<I, J>[] = this.items.filter((i) => !isDefined(i.deref()));

		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}

}

export default GarbageCollectablePairedSetImpl;