import AbstractContextImpl from "context/AbstractContextImpl";
import { Context, Stage } from 'context/Context';
import { UnsupportedOperationError } from "error/Errors";
import IterableWeakSet from "pattern/IterableWeakSet";
import { isDefined } from "util/Utils";
import { MutableProperties } from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";
import DEFAULT_PROPERTIES_VALUES from 'SysProps';
import Registry from "registry/Registry";
import RegistryImpl from "registry/RegistryImpl";
import Scope from "scope/Scope";
import ScopeImpl from "scope/ScopeImpl";
import COMPARE from "const/Compare";

class GlobalContext extends AbstractContextImpl<Context> {

	public getStage(): Stage {
		throw new Error("Method not implemented.");
	}

	public removeChild(name: string): Context {
		// Intentionally do nothing
		return this;
	}

	public getChild(name: string): Context {
		return null;
	}

	public hasChild(name: string): boolean {
		return false;
	}

	public addChild(name: string, initializer?: (context: Context) => void): Context {
		throw new UnsupportedOperationError("Operation not supported.");
	}

	private children: IterableWeakSet<Context>;

	constructor() {
		super("Global");
		this.children = new IterableWeakSet();
		this.init();
	}

	public addRootChild(child: Context): void {
		this.children.add(child);
	}

	public removeRootChild(child: Context): void {
		this.children.remove(child);
	}

	public tell(name: string, payload?: any): void {
		// TODO - Implement
	}

	public getParent(): Context {
		return this;
	}

	public createChild(): Context {
// return new
		throw new UnsupportedOperationError("TODO - Implement");
	}

	protected forParent(fn: (parent: Context) => void): void {
		// Intentionally do nothing
	}

	protected forChildren(callback: (child: Context) => void): void {
		if (isDefined(callback)) {
			this.children.forEach(callback);
		}
	}

	protected createProperties(): MutableProperties {
		return new PropertiesImpl().load(DEFAULT_PROPERTIES_VALUES).extend();
	}

	protected createRegistry(): Registry {
		return new RegistryImpl(this);
	}

	protected createScope(): Scope {
		return new ScopeImpl().add("compare", COMPARE).extend() as ScopeImpl;
	}

	private init(): void {
		// TODO - Implement
	}

}

const GLOBAL_CONTEXT: GlobalContext = new GlobalContext();

export { GlobalContext, GLOBAL_CONTEXT };
