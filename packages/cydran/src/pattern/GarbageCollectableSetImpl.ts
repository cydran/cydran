import GarbageCollectableSet from "pattern/GarbageCollectableSet";
import { isDefined, removeFromArray, requireNotNull } from "util/Utils";

type SupportData<M> = {
	metadata: M;
	finalizer: Finalizer<M>;
};

type Finalizer<M> = (metadata: M) => void;

class GarbageCollectableSetImpl<I extends object, M extends object> implements GarbageCollectableSet<I, M> {

	private items: WeakRef<I>[];

	private supportDatas: WeakMap<I, SupportData<M>>;

	private finalizationRegistry: FinalizationRegistry<SupportData<M>>;

	constructor() {
		this.items = [];
		this.supportDatas = new WeakMap();
		this.finalizationRegistry = new FinalizationRegistry((supportData: SupportData<M>) => {
			if (isDefined(supportData.finalizer)) {
				supportData.finalizer(supportData.metadata);
			}
		});
	}

	public add(item: I, metadata: M = {} as M, finalizer?: Finalizer<M>): void {
		requireNotNull(item, "item");
		this.remove(item);
		this.prune();
		this.items.push(new WeakRef(item));
		const supportData: SupportData<M> = {
			metadata: metadata,
			finalizer: finalizer 
		};

		this.supportDatas.set(item, supportData);
		this.finalizationRegistry.register(item, supportData);
	}

	public remove(item: I): void {
		this.prune();

		const removableItems: WeakRef<I>[] = this.items.filter((ref) => ref.deref() === item);

		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}

	public forEach(callback: (refObject: I, metadata: M) => void): void {
		this.prune();

		for (const ref of this.items) {
			const item: I = ref.deref();
			const supportData: SupportData<M>  = this.supportDatas.get(item);

			if (isDefined(item)) {
				callback(item, supportData.metadata);
			}
		}
	}

	public clear(): void {
		this.items = [];
		this.supportDatas = new WeakMap();
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
		const removableItems: WeakRef<I>[] = this.items.filter((i) => !isDefined(i.deref()));

		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}
}

export default GarbageCollectableSetImpl;