import AbstractNamedContextImpl from "context/AbstractNamedContextImpl";
import Context from 'context/Context';
import { requireNotNull, requireValid } from "util/Utils";
import { VALID_ID } from "const/HardValues";
import { MutableProperties } from "properties/Property";
import Registry from "registry/Registry";
import Scope from "scope/Scope";

class ChildContextImpl extends AbstractNamedContextImpl<Context> {

	private parent: Context;

	private root: Context;

	constructor(name: string, parent: Context) {
		super(name);
		this.parent = requireNotNull(parent, "parent");
		this.root = parent.getRoot();
	}

	public expose(id: string): Context {
		requireValid(id, "id", VALID_ID);

		// TODO - Implement

		throw new Error("Method not implemented.");
	}

	public getParent(): Context {
		return this.parent;
	}

	public isRoot(): boolean {
		return false;
	}

	public getRoot(): Context {
		return this.root;
	}

	protected createProperties(): MutableProperties {
		return this.parent.getProperties().extend();
	}

	protected createRegistry(): Registry {
		return this.parent.getRegistry().extend(this);
	}

	protected createScope(): Scope {
		return this.parent.getScope().extend();
	}

	protected forParent(callback: (parent: Context) => void): void {
		callback(this.parent);
	}

}

export default ChildContextImpl;
