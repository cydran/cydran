import NullValueError from "@/error/NullValueError";
import ScopeError from "@/error/ScopeError";
import Scope from "@/Scope";

interface ScopeMap {

	[name: string]: any;

}

interface ScopeSet {

	[name: string]: string;

}

const EXCLUSIONS: ScopeSet = {
	e: "e",
	external: "external",
	i: "i",
	item: "item",
	m: "m",
	model: "model",
	p: "p",
	parent: "parent",
};

const VALID_KEY_REGEX: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z0-9\$\_]*$/);

class ScopeImpl implements Scope {

	private code: string;

	private children: ScopeImpl[];

	private localItems: ScopeMap;

	private items: ScopeMap;

	private parent: ScopeImpl;

	private restricted: boolean;

	constructor(restricted?: boolean) {
		this.children = [];
		this.localItems = {};
		this.items = {};
		this.code = "";
		this.parent = null;
		this.restricted = (restricted === null || restricted === undefined) ? true : restricted;
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

	public getItems(): ScopeMap {
		return this.items;
	}

	public getCode(): string {
		return this.code;
	}

	public add(name: string, item: any): void {
		this.checkName(name);
		this.localItems[name] = item;
		this.refresh();
		this.refreshChildren();
	}

	public remove(name: string): void {
		this.checkName(name);
		delete this.localItems[name];
		this.refresh();
		this.refreshChildren();
	}

	private checkName(name: string): void {
		if (name === null || name === undefined) {
			throw new NullValueError("name must not be null or undefined.");
		}

		if (!VALID_KEY_REGEX.test(name)) {
			throw new ScopeError("Only objects with names containing letters and numbers and starting with a letter are allowed.");
		}

		if (this.restricted && EXCLUSIONS[name]) {
			throw new ScopeError(name + " is a reserved name in the scope.");
		}
	}

	private refresh(): void {
		this.items = {};

		if (this.parent) {
			const parentItems: ScopeMap = this.parent.getItems();

			for (const key in parentItems) {
				if (parentItems.hasOwnProperty(key)) {
					this.items[key] = parentItems[key];
				}
			}
		}

		for (const key in this.localItems) {
			if (this.localItems.hasOwnProperty(key)) {
				this.items[key] = this.localItems[key];
			}
		}

		this.refreshCode();
	}

	private refreshCode(): void {
		this.code = "";

		for (const key in this.items) {
			if (this.items.hasOwnProperty(key)) {
				const statement: string = "var " + key + " = arguments[0]['" + key + "'];\n";
				this.code += statement;
			}
		}
	}

	private refreshChildren(): void {
		for (const child of this.children) {
			child.refresh();
		}
	}

}

export default ScopeImpl;
