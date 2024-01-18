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
import { RootContextImpl } from "context/AbstractNamedContextImpl";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import GlobalContextHolder from 'context/GlobalContextHolder';
import GlobalContext from 'context/GlobalContext';
import { argumentsBuilder } from 'const/Builder';
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import ScriptVisitor from 'component/visitor/ScriptVisitor';
import CSSClassBehavior from "behavior/core/CSSClassBehavior";
import HiddenBehavior from "behavior/core/HiddenBehavior";
import IfBehavior from "behavior/core/IfBehavior";

class GlobalContextImpl extends AbstractContextImpl<Context> implements GlobalContext {

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
		const root: Context = new RootContextImpl();
		this.addRootChild(root);

		return root;
	}

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

		// const fn: BehaviorFunction = (el: HTMLInputElement) => isDefined(el.type) && el.type.toLowerCase() === "radio" ? RadioModelBehavior : ValuedModelBehavior;
		// stage.registerBehavior("model", ["textarea"], ValuedModelBehavior);
		// stage.registerBehaviorFunction("model", ["input"], fn);
		// stage.registerBehavior("model", ["select"], MultiSelectValueModelBehavior);
		// stage.registerBehavior("required", ["input", "select", "textarea"], RequiredBehavior);
		// stage.registerBehavior("style", ["*"], StyleBehavior);
		// stage.registerBehavior("validated", ["*"], ValidatedBehavior);
		// stage.registerBehavior("readonly", ["input", "textarea"], ReadOnlyBehavior);
		// stage.registerBehavior("inert", ["*"], InertBehavior);
		this.getRegistry().registerPrototype("cydran:behavior:if:*", IfBehavior);


		// stage.registerBehavior("id", ["*"], IdBehavior);

		this.getRegistry().registerPrototype("cydran:behavior:hidden:*", HiddenBehavior);

		// stage.registerBehavior("focus", ["*"], FocusBehavior);
		// stage.registerBehavior("enabled", ["*"], EnabledBehavior);
		// stage.registerBehavior("each", ["*"], EachBehavior);

		this.getRegistry().registerPrototype("cydran:behavior:class:*", CSSClassBehavior);

		// stage.registerBehavior("class", ["*"], CSSClassBehavior);
		// stage.registerBehavior("checked", ["input"], CheckedBehavior);
	




		this.getRegistry().registerSingleton("cydran:textVisitor", TextVisitor);
		this.getRegistry().registerSingleton("cydran:otherVisitor", OtherVisitor, argumentsBuilder().withContext().build());
		this.getRegistry().registerSingleton("cydran:scriptVisitor", ScriptVisitor);
		this.getRegistry().registerSingleton("cydran:domWalker", MvvmDomWalkerImpl,
		argumentsBuilder().with("cydran:textVisitor").with("cydran:otherVisitor").with("cydran:scriptVisitor").build());
	}

}

GlobalContextHolder.setContext(new GlobalContextImpl());

export default GlobalContextImpl;
