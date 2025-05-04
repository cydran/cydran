import AbstractContextImpl from "context/AbstractContextImpl";
import { Context, Registry } from 'context/Context';
import { UnsupportedOperationError } from "error/Errors";
import GarbageCollectableSet from "pattern/GarbageCollectableSet";
import GarbageCollectableSetImpl from "pattern/GarbageCollectableSetImpl";
import { isDefined, requireValid } from "util/Utils";
import { MutableProperties } from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";
import { DEFAULT_PROPERTIES_VALUES } from "CydranConstants";
import RegistryImpl from "registry/RegistryImpl";
import Scope from "scope/Scope";
import ScopeImpl from "scope/ScopeImpl";
import { RootContextImpl } from "context/AbstractNamedContextImpl";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import GlobalContextHolder from 'context/GlobalContextHolder';
import GlobalContext from 'context/GlobalContext';
import argumentsBuilder from 'function/argumentsBuilder';
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import CSSClassBehavior from "behavior/core/CSSClassBehavior";
import HiddenBehavior from "behavior/core/HiddenBehavior";
import IfBehavior from "behavior/core/IfBehavior";
import EnabledBehavior from "behavior/core/EnabledBehavior";
import IdBehavior from "behavior/core/IdBehavior";
import InertBehavior from "behavior/core/InertBehavior";
import ReadOnlyBehavior from "behavior/core/ReadOnlyBehavior";
import FocusBehavior from "behavior/core/FocusBehavior";
import CheckedBehavior from "behavior/core/CheckedBehavior";
import EachBehavior from "behavior/core/EachBehavior";
import MultiSelectValueModelBehavior from "behavior/core/MultiSelectValueModelBehavior";
import StyleBehavior from "behavior/core/StyleBehavior";
import ValidatedBehavior from "behavior/core/ValidatedBehavior";
import RequiredBehavior from "behavior/core/RequiredBehavior";
import ValuedModelBehavior from "behavior/core/ValuedModelBehavior";
import RadioModelBehavior from "behavior/core/RadioModelBehavior";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";
import SegmentDigesterImpl from 'digest/SegmentDigesterImpl';
import DigestionStateImpl from 'digest/DigestionStateImpl';
import DigesterImpl from 'digest/DigesterImpl';
import { CONTEXT_NAME, To } from "CydranConstants";

type BehaviorFunction = (el?: HTMLElement) => Type<Behavior<unknown, HTMLElement | Text, unknown>>;

class GlobalContextImpl extends AbstractContextImpl<Context> implements GlobalContext {

	private children: GarbageCollectableSet<Context, Object>;

	constructor() {
		super("Global");
		this.children = new GarbageCollectableSetImpl();
		this.init();
	}

	public getRoot(): Context {
		return this;
	}

	public addPreInitializer(thisObject: Object, callback: (context?: Context) => void): void {
		// Intentionally do nothing
	}

	public addInitializer(thisObject: Object, callback: (context?: Context) => void): void {
		// Intentionally do nothing
	}

	public addDisposer(thisObject: Object, callback: (context?: Context) => void): void {
		// Intentionally do nothing
	}

	public $release(): void {
		// Intentionally do nothing
	}

	public getFullName(): string {
		return this.getName();
	}

	public isRoot(): boolean {
		return true;
	}

	public sendToImmediateChildren(channelName: string, messageName: string, payload?: unknown): void {
		this.children.forEach((child: Context) => {
			child.message(channelName, messageName, payload);
		});
	}

	public sendToDescendants(channelName: string, messageName: string, payload?: unknown): void {
		this.children.forEach((child: Context) => {
			child.message(channelName, messageName, payload);
			child.send(To.DESCENDANTS, channelName, messageName, payload);
		});
	}

	public addRootChild(child: Context): void {
		this.children.add(child);
	}

	public removeRootChild(child: Context): void {
		this.children.remove(child);
	}

	public tell(name: string, payload?: unknown): void {
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

	public removeChild(name: string): Context {
		requireValid(name, "name", CONTEXT_NAME);

		// Intentionally do nothing

		return this;
	}

	public getChild(name: string): Context {
		requireValid(name, "name", CONTEXT_NAME);

		return null;
	}

	public hasChild(name: string): boolean {
		requireValid(name, "name", CONTEXT_NAME);

		return false;
	}

	public addChild(name: string, initializer?: (context: Context) => void): Context {
		requireValid(name, "name", CONTEXT_NAME);

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
		return new ScopeImpl()
			// .add("compare", COMPARE)
			.extend() as ScopeImpl;
	}

	private init(): void {
		const fn: (el?: HTMLElement) => Behavior<string, HTMLInputElement, unknown> =
			(el: HTMLInputElement) => isDefined(el.type) && el.type.toLowerCase() === "radio" ? new RadioModelBehavior() : new ValuedModelBehavior();
		this.registerPrototypeWithFactory("cydran:behavior:model:input", fn, argumentsBuilder().withArgument(0).build());

		this.registerSingleton("cydranSegmentDigester", SegmentDigesterImpl, argumentsBuilder().withLogger("cydranSegmentDigester").build());
		this.registerPrototype("cydranDigestionState", DigestionStateImpl, argumentsBuilder().with("cydranSegmentDigester").build());
		this.registerPrototype("cydranDigester", DigesterImpl, argumentsBuilder()
			.withLogger("cydranDigester")
			.withProvider("cydranDigestionState")
			.withArgument(0)
			.withArgument(1)
			.withArgument(2)
			.withArgument(3)
			.build()
		);

		this.registerPrototype("cydran:behavior:model:textarea", ValuedModelBehavior);
		this.registerPrototype("cydran:behavior:model:select", MultiSelectValueModelBehavior);
		this.registerPrototype("cydran:behavior:required:input", RequiredBehavior);
		this.registerPrototype("cydran:behavior:required:select", RequiredBehavior);
		this.registerPrototype("cydran:behavior:required:textarea", RequiredBehavior);
		this.registerPrototype("cydran:behavior:style:*", StyleBehavior);
		this.registerPrototype("cydran:behavior:validated:*", ValidatedBehavior);
		this.registerPrototype("cydran:behavior:readonly:input", ReadOnlyBehavior);
		this.registerPrototype("cydran:behavior:readonly:textarea", ReadOnlyBehavior);
		this.registerPrototype("cydran:behavior:inert:*", InertBehavior);
		this.registerPrototype("cydran:behavior:if:*", IfBehavior);
		this.registerPrototype("cydran:behavior:id:*", IdBehavior);
		this.registerPrototype("cydran:behavior:hidden:*", HiddenBehavior);
		this.registerPrototype("cydran:behavior:focus:*", FocusBehavior);
		this.registerPrototype("cydran:behavior:enabled:*", EnabledBehavior);
		this.registerPrototype("cydran:behavior:each:*", EachBehavior);
		this.registerPrototype("cydran:behavior:class:*", CSSClassBehavior);
		this.registerPrototype("cydran:behavior:checked:input", CheckedBehavior);

		this.registerSingleton("cydran:textVisitor", TextVisitor);
		this.registerSingleton("cydran:otherVisitor", OtherVisitor, argumentsBuilder().withContext().build());
		this.registerSingleton("cydran:domWalker", MvvmDomWalkerImpl, argumentsBuilder().with("cydran:textVisitor")
			.with("cydran:otherVisitor").build());
	}

}

GlobalContextHolder.setContext(new GlobalContextImpl());

export default GlobalContextImpl;
