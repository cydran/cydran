import SimpleMap from "interface/SimpleMap";
import Scope from "scope/Scope";
import { SCOPE_KEY } from "CydranConstants";
import { cloneShallow, isDefined, requireNotNull, requireValid } from 'util/Utils';
import emptyObject from "function/emptyObject";

class ScopeImpl implements Scope {

	private children: ScopeImpl[];

	private localItems: SimpleMap<unknown>;

	private items: SimpleMap<unknown>;

	private parent: ScopeImpl;

	private mFn: () => unknown;

	private vFn: () => unknown;

	constructor() {
		this.children = [];
		this.localItems = {};
		this.items = {};
		this.parent = null;
		this.mFn = () => ({});
		this.vFn = () => ({});
	}

	public extend(): Scope {
		const child = new ScopeImpl();
		child.setParent(this);

		return child;
	}

	public setParent(parent: ScopeImpl): void {
		if (!parent) {
			return;
		}

		if (this.parent) {
			this.parent.removeChild(this);
		}

		this.parent = parent;
		this.parent.addChild(this);
		this.refresh();
	}

	public addChild(child: ScopeImpl): void {
		if (child) {
			this.children.push(child);
		}
	}

	public removeChild(child: ScopeImpl): void {
		const index: number = this.children.indexOf(child);

		if (index >= 0) {
			this.children.splice(index, 1);
		}
	}

	public getItems(): SimpleMap<unknown> {
		return this.items;
	}

	public getItemsCopy(): SimpleMap<unknown> {
		return cloneShallow(this.items);
	}

	public add(name: string, item: unknown): Scope {
		requireValid(name, "name", SCOPE_KEY);
		this.localItems[name] = item;
		this.refresh();
		this.refreshChildren();

		return this;
	}

	public remove(name: string): Scope {
		requireValid(name, "name", SCOPE_KEY);
		delete this.localItems[name];
		this.refresh();
		this.refreshChildren();

		return this;
	}

	public get<T>(name: string): T {
		requireValid(name, "name", SCOPE_KEY);
		const result: T = this.localItems[name] as T;

		return isDefined(result) ? result : null as T;
	}

	public getMFn(): () => unknown {
		return this.mFn;
	}

	public setMFn(mFn: () => unknown) {
		this.mFn = isDefined(mFn) ? mFn : emptyObject;
	}

	public getVFn(): () => unknown {
		return this.vFn;
	}

	public setVFn(vFn: () => unknown) {
		this.vFn = isDefined(vFn) ? vFn : emptyObject;
	}

	private refresh(): void {
		this.items = {};

		if (this.parent) {
			const parentItems: SimpleMap<unknown> = this.parent.getItems();

			for (const key in parentItems) {
				if (!parentItems.hasOwnProperty(key)) {
					continue;
				}

				this.items[key] = parentItems[key];
			}
		}

		for (const key in this.localItems) {
			if (!this.localItems.hasOwnProperty(key)) {
				continue;
			}

			this.items[key] = this.localItems[key];
		}
	}


	private refreshChildren(): void {
		for (const child of this.children) {
			child.refresh();
		}
	}

}

export default ScopeImpl;
