import { INTERNAL_CHANNEL_NAME, Ids, PropertyKeys } from "@/Constants";
import {
	requireNotNull,
	extractAttributes,
	isDefined,
	requireValid,
	merge,
	createElementOffDom,
	clone,
	equals,
	createCommentOffDom,
	createTextNodeOffDom,
	startsWith,
	removeFromBeginning,
	elementAsString,
	extractAttribute,
	trim,
	domReady,
	endsWith,
	createDocumentFragmentOffDom,
	uuidV4
} from "@/Utils";
import {
	Properties,
	Nestable,
	InternalComponentOptions,
	MetadataContinuation,
	ComponentInternals,
	Renderer,
	NamedElementOperations,
	OnContinuation,
	Scope,
	Logger,
	ElementReference,
	MediatorSource,
	Module,
	PubSub,
	Region,
	AttributeExtractor,
	Digester,
	DigestionCandidateConsumer,
	DomWalker,
	ElementMediator,
	Messagable,
	ModelMediator,
	SimpleMap,
	Mvvm,
	ElementMediatorDependencies,
	ElementVisitor,
	Validators,
	Type,
	DigestionContext,
	DigestionCandidate,
	Notifyable,
	EventHooks,
	Register,
	ModulesContext,
	MutableProperties,
	Broker,
	Listener,
	RegistryStrategy,
	Registry,
	ComponentOptions
} from "@/Interfaces";
import { INTERNAL_DIRECT_CHANNEL_NAME, MODULE_FIELD_NAME, NO_OP_FN, EMPTY_OBJECT_FN, VALID_ID } from "@/Constants";
import { TemplateError, UnknownRegionError, SetComponentError, UnknownElementError, ModuleAffinityError } from "@/Errors";
import { PubSubImpl } from "@/Message";
import { LockedRegionError } from "@/Errors";
import {
	ANONYMOUS_REGION_PREFIX,
	DEFAULT_CLONE_DEPTH,
	DEFAULT_EQUALS_DEPTH,
	Attrs,
	NESTING_CHANGED,
	Events
} from "@/Constants";
import { CYDRAN_SCRIPT_PREFIX } from "@/Constants";
import { UnknownComponentError } from "@/Errors";
import { Validator } from "@/Interfaces";
import { MalformedOnEventError } from "@/Errors";
import { RegistryImpl } from "@/Registry";
import { DEFAULT_MODULE_KEY, VALID_KEY } from "@/Constants";
import DEFAULT_PROPERTIES_VALUES from "@/properties.json";
import { BrokerImpl } from "@/Message";
import { LoggerFactory } from "@/Logger";
import { AmbiguousMarkupError } from "@/Errors";
import { ComponentFactory, IdStrategy } from '@/Interfaces';
import { NodeTypes } from "@/Constants";
import { ValidationError } from "@/Errors";
import { NullValueError, ScopeError } from "@/Errors";
import {
	FilterBuilder,
	Watcher,
	Phase,
	Callback,
	Filter,
	PagedFilter,
	LimitOffsetFilter,
	Supplier,
	Watchable,
	StageBuilder,
	Stage,
	ComponentIdPair,
	Hooks,
	Level
} from "@/Interfaces";
import { SelectorError } from "@/Errors";
import { LoggerServiceImpl } from "@/Logger";

class DefinedValidatorsImpl implements Validators {

	private name: string;

	private value: any;

	private consumer: (error: string) => void;

	constructor(name: string, value: any, consumer: (error: string) => void) {
		this.name = name;
		this.value = value;
		this.consumer = consumer;
	}

	public matches(regex: RegExp): Validators {
		if (!regex.test(this.value + '')) {
			this.consumer(` ${ this.name } must match ${ regex }`);
		}

		return this;
	}

	public isDefined(): Validators {
		return this;
	}

	public oneOf(...options: any[]): Validators {
		let invalid: boolean = true;

		for (const option of options) {
			if (this.value === option) {
				invalid = false;
				break;
			}
		}

		if (invalid) {
			let message: string = `${ this.name } must be one of: `;

			let afterFirst: boolean = false;

			for (const option of options) {
				if (afterFirst) {
					message += ", ";
				}

				message += option;
				afterFirst = true;
			}

			this.consumer(message);
		}


		return this;
	}

	public requireIfDefined(name: string, requiredValue: any): Validators {
		if (!isDefined(requiredValue)) {
			this.consumer(`${ name } must be defined if ${ this.name } is defined`);
		}

		return this;
	}

	public requireIfEquals(expected: any, name: string, requiredValue: any): Validators {
		if (this.value === expected && !isDefined(requiredValue)) {
			this.consumer(`${ name } must be defined if ${ this.name } is ${ expected }`);
		}

		return this;
	}

	public requireIfTrue(test: boolean): Validators {
		return this;
	}

	public disallowIfTrue(test: boolean, message: string): Validators {
		if (test) {
			this.consumer(`${ this.name } must not be defined ${ message }`);
		}

		return this;
	}

	public notEmpty(): Validators {
		if ((this.value + '').trim() === "") {
			this.consumer(`${ this.name } must not be empty`);
		}

		return this;
	}

	public reject(message: string): Validators {
		this.consumer(`${ this.name } ${ message }`);

		return this;
	}

}

class UndefinedValidatorsImpl implements Validators {

	private name: string;

	private value: any;

	private consumer: (error: string) => void;

	constructor(name: string, value: any, consumer: (error: string) => void) {
		this.name = name;
		this.value = value;
		this.consumer = consumer;
	}

	public matches(regex: RegExp): Validators {
		return this;
	}

	public isDefined(): Validators {
		this.consumer(`${ this.name } must be defined`);

		return this;
	}

	public oneOf(...options: any[]): Validators {
		return this;
	}

	public requireIfDefined(name: string, requiredValue: any): Validators {
		return this;
	}

	public requireIfEquals(expected: any, name: string, requiredValue: any): Validators {
		return this;
	}

	public requireIfTrue(test: boolean): Validators {
		if (test) {
			this.consumer(`${ this.name } must be defined if ${ this.name }`);
		}

		return this;
	}

	public disallowIfTrue(test: boolean, message: string): Validators {
		return this;
	}

	public notEmpty(): Validators {
		return this;
	}

	public reject(message: string): Validators {
		this.consumer(`${ this.name } ${ message }`);

		return this;
	}

}

class ValidatorImpl implements Validator {

	private errors: string[];

	constructor() {
		this.errors = [];
	}

	public getFunction(): (name: string, value?: any) => Validators {
		const consumer: (error: string) => void = (error: string) => this.errors.push(error);
		return (name: string, value: any) => isDefined(value)
			? new DefinedValidatorsImpl(name, value, consumer)
			: new UndefinedValidatorsImpl(name, value, consumer);
	}

	public throwIfErrors(prefixFn: () => string): void {
		if (this.errors.length > 0) {
			let message: string = `${ prefixFn() }\n\nDetails:\n`;

			for (const error of this.errors) {
				message += `\n    - ${ error }`;
			}

			throw new ValidationError(`${ message }\n`);
		}
	}

}

function asIdentity(input: any): any {
	return input;
}

function asBoolean(input: any): boolean {
	return Boolean(input);
}

function asString(input: any): string {
	return isDefined(input) ? ('' + input) : null;
}

function asNumber(input: any): number {
	return isDefined(input) ? Number(input) : null;
}

class EventHooksImpl<T> implements EventHooks<T> {

	private listeners: ((context: T) => void)[];

	constructor() {
		this.listeners = [];
	}

	public add(listener: (context: T) => void): void {
		requireNotNull(listener, "listener");
		this.listeners.push(listener);
	}

	public notify(context: T): void {
		for (const listener of this.listeners) {
			listener.apply({}, [context]);
		}
	}

}

class HooksImpl implements Hooks {

	public static readonly INSTANCE: Hooks = new HooksImpl();

	public getDigestionCycleStartHooks(): EventHooks<Nestable> {
		return DigesterImpl.DIGESTION_CYCLE_START_HOOKS;
	}

}

class Setter<T> {

	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.logger = LoggerFactory.getLogger(`Setter: ${ expression }`);
		this.expression = expression;
	}

	public set(scope: ScopeImpl, value: T): void {
		const code: string = `'use strict'; ${ scope.getCode() } ${ this.expression } = arguments[1];`;

		try {
			Function(code).apply({}, [scope.getItems(), value]);
		} catch (e) {
			this.logInvocationError(code, e);
		}
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.error(`\nAn error (${ e.name }) was thrown invoking the element mediator expression: ${ this.expression }\n\nIn context:\n${ code }\n\nException message: ${ e.message }\n\n`, e);
	}

}

const EXCLUSIONS: SimpleMap<string> = {
	v: "v",
	value: "value",
	m: "m",
	model: "model",
	p: "p",
	parent: "param",
	compare: "compare"
};

class ScopeImpl implements Scope {

	private code: string;

	private children: ScopeImpl[];

	private localItems: SimpleMap<any>;

	private items: SimpleMap<any>;

	private parent: ScopeImpl;

	private restricted: boolean;

	constructor(restricted?: boolean) {
		this.children = [];
		this.localItems = {};
		this.items = {};
		this.code = "";
		this.parent = null;
		this.restricted = (restricted === null || restricted === undefined) || restricted;
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

	public getItems(): SimpleMap<any> {
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

		if (!VALID_KEY.test(name)) {
			throw new ScopeError("Only objects with names starting with a letter and containing letters and numbers are allowed.");
		}

		if (this.restricted && EXCLUSIONS[name]) {
			throw new ScopeError(`${ name } is a reserved name in the scope.`);
		}
	}

	private refresh(): void {
		this.items = {};

		if (this.parent) {
			const parentItems: SimpleMap<any> = this.parent.getItems();

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

		this.refreshCode();
	}

	private refreshCode(): void {
		this.code = "";

		for (const key in this.items) {
			if (!this.items.hasOwnProperty(key)) {
				continue;
			}

			const statement: string = `var ${ key } = arguments[0]['${ key }'];\n`;
			this.code += statement;
		}
	}

	private refreshChildren(): void {
		for (const child of this.children) {
			child.refresh();
		}
	}

}

class ModelMediatorImpl<T> implements ModelMediator<T> {

	private logger: Logger;

	private model: any;

	private expression: string;

	private previous: T;

	private watchPrevious: T;

	private watchCurrent: T;

	private watchDispatchPending: boolean;

	private scope: ScopeImpl;

	private context: any;

	private digested: boolean = false;

	private target: (previous: T, current: T) => void;

	private invoker: Invoker;

	private getter: Getter<T>;

	private setter: Setter<T>;

	private reducerFn: (input: any) => T;

	private cloneFn: (input: any) => any;

	private equalsFn: (first: any, second: any) => boolean;

	constructor(
		model: any,
		expression: string,
		scope: ScopeImpl,
		reducerFn: (input: any) => T,
		cloneFn: (input: any) => any,
		equalsFn: (first: any, second: any) => boolean
	) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.model = requireNotNull(model, "model");
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope, "scope");
		this.logger = LoggerFactory.getLogger("ModelMediator: " + expression);
		this.previous = null;
		this.context = {};
		this.target = null;
		this.invoker = new Invoker(expression);
		this.getter = new Getter(expression);
		this.setter = new Setter(expression);
		this.cloneFn = requireNotNull(cloneFn, "cloneFn");
		this.equalsFn = requireNotNull(equalsFn, "equalsFn");
	}

	public invoke(params?: any): void {
		this.invoker.invoke(this.scope, params || {});
	}

	public get(): T {
		return this.reducerFn.apply({}, [this.getter.get(this.scope)]);
	}

	public set(value: T): void {
		this.setter.set(this.scope, value);
	}

	public evaluate(): boolean {
		if (!this.target) {
			return false;
		}

		let changed: boolean = false;
		const value: T = this.get();

		if (this.digested) {
			if (this.equalsFn(this.previous, value)) {
				this.logger.ifTrace(() => ({ message: "Not different.", value: value }));
			} else {
				if (this.logger.isTrace()) {
					this.logger.trace({ current: value, previous: this.previous });
				}

				this.logger.trace("Invoking listener");
				this.swap(value);
				changed = true;
			}
		} else {
			this.swap(value);
			changed = true;
			this.digested = true;
		}

		return changed;
	}

	public notify(): void {
		if (this.watchDispatchPending) {
			this.target.apply(this.context, [this.watchPrevious, this.watchCurrent]);
			this.watchDispatchPending = false;
		}
	}

	public watch(context: any, target: (previous: T, current: T) => void): void {
		this.context = requireNotNull(context, "context");
		this.target = requireNotNull(target, "target");
	}

	public dispose(): void {
		this.model = null;
		this.previous = null;
		this.context = null;
		this.target = null;
		this.watchPrevious = null;
		this.watchCurrent = null;
		this.watchDispatchPending = false;
	}

	public getExpression(): string {
		return this.expression;
	}

	private swap(value: T): void {
		const newPrevious: T = this.cloneFn(value);
		this.watchPrevious = this.previous;
		this.watchCurrent = value;
		this.watchDispatchPending = true;
		this.previous = newPrevious;
	}

}

class Invoker {

	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.expression = expression;
		this.logger = LoggerFactory.getLogger("Invoker: " + expression);
	}

	public invoke(scope: ScopeImpl, params: any): void {
		const aggregateScope: SimpleMap<any> = {};
		const scopeItems: SimpleMap<any> = scope.getItems();

		for (const key in scopeItems) {
			if (!scopeItems.hasOwnProperty(key)) {
				continue;
			}

			aggregateScope[key] = scopeItems[key];
		}

		if (params !== null && params !== undefined) {
			for (const key in params) {
				if (!params.hasOwnProperty(key)) {
					continue;
				}

				aggregateScope[key] = params[key];
			}
		}

		let aggregateScopeCode: string = "";

		for (const key in aggregateScope) {
			if (!aggregateScope.hasOwnProperty(key)) {
				continue;
			}

			const statement: string = `var ${ key } = arguments[0]['${ key }'];\n`;
			aggregateScopeCode += statement;
		}

		const code: string = `'use strict'; ${ aggregateScopeCode } (${ this.expression });`;

		try {
			Function(code).apply({}, [aggregateScope]);
		} catch (e) {
			this.logInvocationError(code, e);
		}
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.error(`\nAn error (${ e.name }) was thrown invoking the element mediator expression: ${ this.expression }\n\nIn context:\n${ code }\n\nException message: ${ e.message }\n\n`, e);
	}

}

class IndexedEvaluator<T> {

	private expression: string;

	private logger: Logger;

	private code: string;

	private reducerFn: (input: any) => T;

	private scope: ScopeImpl;

	constructor(expression: string, scope: Scope, reducerFn: (input: any) => T) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.logger = LoggerFactory.getLogger("Evaluator: " + expression);
		this.expression = expression;
		this.scope = scope as ScopeImpl;
		this.code = `use strict'; ${ this.scope.getCode() } var v = arguments[1]; var $index = arguments[2]; var p = arguments[3]; return (${ this.expression });`;
	}

	public test(subject: any, index: number, values: (() => any)[]): T {
		let value: T = null;
		const subjectFn: () => any = () => subject;
		const valueFn: (index: number) => any = (i) => values[i]();

		try {
			value = Function(this.code).apply({}, [this.scope.getItems(), subjectFn, index, valueFn]);
		} catch (e) {
			this.logger.error(`\nAn error (${ e['name'] }) was thrown invoking the element mediator expression: ${ this.expression }\n\nIn context:\n${ this.code }\n\nException message: ${ e['message'] }\n\n`, e);
		}

		const result = this.reducerFn(value);

		return result;
	}

}

class Getter<T> {

	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.logger = LoggerFactory.getLogger("Getter: " + expression);
		this.expression = expression;
	}

	public get(scope: ScopeImpl): T {
		const code: string = `'use strict'; ${ scope.getCode() } return (${ this.expression });`;
		let value: any = null;

		try {
			value = Function(code).apply({}, [scope.getItems()]);
		} catch (e) {
			this.logInvocationError(code, e);
		}

		return value;
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.ifWarn(() => `\nAn exception (${ e.name }) was thrown invoking the element mediator expression: ${ this.expression }\n\nIn context:\n${ code }\n\nException message: ${ e.message }\n\n`, e);
	}

}

class Evaluator {

	private expression: string;

	private logger: Logger;

	private scope: ScopeImpl;

	private code: string;

	constructor(expression: string, scope: ScopeImpl) {
		this.logger = LoggerFactory.getLogger("Evaluator: " + expression);
		this.expression = expression;
		this.scope = scope;
		this.code = `"use strict"; ${ scope.getCode() } return (${ this.expression });`;
	}

	public test(): boolean {
		let value: boolean = null;

		try {
			value = !!Function(this.code).apply({}, [this.scope.getItems()]);
		} catch (e) {
			this.logger.error(`\nAn error (${ e['name'] }) was thrown invoking the element mediator expression: ${ this.expression }\n\nIn context:\n${ this.code }\n\nException message: ${ e['message'] }\n\n`, e);
		}

		return value;
	}

}

class ComparisonEvaluator {

	private expression: string;

	private logger: Logger;

	private code: string;

	private scope: ScopeImpl;

	constructor(expression: string, scope: Scope) {
		this.logger = LoggerFactory.getLogger("Evaluator: " + expression);
		this.expression = expression;
		this.scope = scope as ScopeImpl;
		this.code = `'use strict'; ${ this.scope.getCode() } var a = arguments[1]; var b = arguments[2]; var p = arguments[3]; return (${ this.expression });`;
	}

	public compare(first: any, second: any, values: (() => any)[]): number {
		let result: number = 0;
		const firstFn: () => any = () => first;
		const secondFn: () => any = () => second;
		const valueFn: (index: number) => any = (i) => values[i]();

		try {
			result = Function(this.code).apply({}, [this.scope.getItems(), firstFn, secondFn, valueFn]);
		} catch (e) {
			this.logger.error(`\nAn error (${ e['name'] }) was thrown invoking the element mediator expression: ${ this.expression }\n\nIn context:\n${ this.code }\n\nException message: ${ e['message'] }\n\n`, e);
		}

		return result;
	}

}

const STATE_OUTSIDE: number = 0;
const STATE_INSIDE_CURLY: number = 1;
const STATE_INSIDE_SQUARE: number = 2;

const COMPARE: any = {
	alpha: (first: string, second: string) => {
		let result: number = 0;

		if (first < second) {
			result = -1;
		} else if (first > second) {
			result = 1;
		}

		return result;
	}
};

class DomWalkerImpl<C> implements DomWalker<C> {

	private visitors: SimpleMap<ElementVisitor<HTMLElement, C>>;

	private defaultVisitor: ElementVisitor<HTMLElement, C>;

	private textVisitor: ElementVisitor<Text, C>;

	private commentVisitor: ElementVisitor<Comment, C>;

	constructor() {
		this.visitors = {};
	}

	public walk(root: HTMLElement, context: C): void {
		const pending: (HTMLElement | Text | Comment)[] = [root];
		const consumer = (element: HTMLElement | Text | Comment) => pending.push(element);

		let topLevel: boolean = true;

		while (pending.length > 0) {
			const element: (HTMLElement | Text | Comment) = pending.pop();

			switch (element.nodeType) {
				case NodeTypes.TEXT:
					this.processText(element as Text, context, consumer, topLevel);
					break;

				case NodeTypes.ELEMENT:
					this.processElement(element as HTMLElement, context, consumer, topLevel);
					break;

				case NodeTypes.COMMENT:
					this.processComment(element as Comment, context, consumer, topLevel);
					break;
			}

			topLevel = false;
		}
	}

	public addVisitor(tagName: string, visitor: ElementVisitor<HTMLElement | Text | Comment, C>): void {
		const key: string = requireNotNull(tagName, "tagName").toLowerCase();
		requireNotNull(visitor, "visitor");

		if (isDefined(this.visitors[key])) {
			throw new ValidationError(`Visitor for ${ key } is already registered`);
		}

		this.visitors[key] = visitor;
	}

	public setTextVisitor(visitor: ElementVisitor<Text, C>): void {
		this.textVisitor = visitor;
	}

	public setCommentVisitor(visitor: ElementVisitor<Comment, C>): void {
		this.commentVisitor = visitor;
	}

	public setDefaultVisitor(visitor: ElementVisitor<HTMLElement, C>): void {
		this.defaultVisitor = visitor;
	}

	private processText(element: Text, context: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (isDefined(this.textVisitor)) {
			this.textVisitor.visit(element, context, consumer, topLevel);
		}
	}

	private processComment(element: Comment, context: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (isDefined(this.commentVisitor)) {
			this.commentVisitor.visit(element as Comment, context, consumer, topLevel);
		}
	}

	private processElement(element: HTMLElement, context: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const htmlElement: HTMLElement = element as HTMLElement;
		const tagName: string = htmlElement.tagName.toLowerCase();
		const visitor: ElementVisitor<HTMLElement, C> = this.visitors[tagName];

		if (isDefined(visitor)) {
			visitor.visit(htmlElement, context, consumer, topLevel);
		} else if (isDefined(this.defaultVisitor)) {
			this.defaultVisitor.visit(htmlElement, context, consumer, topLevel);
		} else {
			// tslint:disable-next-line
			for (let i = 0; i < element.childNodes.length; i++) {
				consumer(element.childNodes[i] as HTMLElement | Text | Comment);
			}
		}
	}

}

class PropertiesImpl implements MutableProperties {

	private parent: Properties;

	private properties: SimpleMap<any>;

	constructor(parent?: Properties) {
		this.parent = parent;
		this.clear();
	}

	public get<T>(key: string): T {
		requireNotNull(key, "key");

		let value: any = null;

		if (this.properties.hasOwnProperty(key)) {
			value = this.properties[key];
		} else if (isDefined(this.parent)) {
			value = this.parent.get(key);
		}

		return value;
	}

	public isDefined(key: string): boolean {
		return isDefined(this.get(key));
	}

	public isTruthy(key: string): boolean {
		const value: any = this.get(key);

		return isDefined(value) ? !!value : false;
	}

	public getAsString(key: string): string {
		const value: any = this.get(key);

		return isDefined(value) ? value + '' : null;
	}

	public set(key: string, value: any): MutableProperties {
		requireNotNull(key, "key");

		this.properties[key] = value;

		return this;
	}

	public remove(key: string): MutableProperties {
		requireNotNull(key, "key");

		if (this.properties.hasOwnProperty(key)) {
			delete this.properties[key];
		}

		return this;
	}

	public clear(): MutableProperties {
		this.properties = {};

		return this;
	}

	public load(values: any): MutableProperties {
		requireNotNull(values, "values");

		for (const key in values) {
			if (!values.hasOwnProperty(key)) {
				continue;
			}

			this.properties[key] = values[key];
		}

		return this;
	}

	public extend(): MutableProperties {
		return new PropertiesImpl(this);
	}

}

class IdGenerator {

	public static readonly INSTANCE: IdGenerator = new IdGenerator();

	private static readonly MAX_VALUE: number = 9007199254740989;

	private major: number;

	private minor: number;

	private micro: number;

	constructor() {
		this.major = 0;
		this.minor = 0;
		this.micro = 0;
	}

	public generate(): string {
		const result: string = `${ this.major }-${ this.minor }-${ this.micro }`;

		this.micro++;

		if (this.micro > IdGenerator.MAX_VALUE) {
			this.micro = 0;
			this.minor++;
		}

		if (this.minor > IdGenerator.MAX_VALUE) {
			this.minor = 0;
			this.major++;
		}

		return result;
	}

}

/**
 * The piece of code between the HTMLElement and the Mvvm
 * @type M {@link ModelMediator}
 * @type E extends HTMLElement
 * @implements {@link Disposable}
 */
abstract class AbstractElementMediator<M, E extends HTMLElement | Text, P> implements ElementMediator<M, E, P> {

	private logger: Logger;

	// tslint:disable-next-line
	private ____internal$$cydran____: ElementMediatorDependencies;

	private mediator: ModelMediator<M>;

	private pubSub: PubSub;

	private propagation: boolean;

	private topLevelSupported: boolean;

	private domListeners: {
		[name: string]: any;
	};

	private id: string;

	private params: P;

	private reducerFn?: (input: any) => M;

	private childrenConsumable: boolean;

	constructor(dependencies: any, propagation: boolean, reducerFn: (input: any) => M, topLevelSupported?: boolean) {
		this.topLevelSupported = isDefined(topLevelSupported) ? topLevelSupported : true;
		this.____internal$$cydran____ = requireNotNull(dependencies, "dependencies");
		this.logger = LoggerFactory.getLogger(`ElementMediator: ${ dependencies.prefix }`);
		this.domListeners = {};
		this.pubSub = new PubSubImpl(this, this.getModule());
		this.params = null;
		this.propagation = propagation;
		this.id = IdGenerator.INSTANCE.generate();
		this.reducerFn = reducerFn;
		this.childrenConsumable = true;

		if (this.____internal$$cydran____.validated) {
			const validator: Validator = new ValidatorImpl();
			this.validate(this.getEl(), validator.getFunction());
			validator.throwIfErrors(() => `Invalid use of a ${ dependencies.prefix } attribute on element ${ elementAsString(this.getEl() as HTMLElement) }`);
		}
	}

	public populate(): void {
		// Intentionally do nothing
	}

	/**
	 * Dispose of ElementMediator when released.
	 * + All event listeners will be removed.
	 * + This element mediator will be unwired from any other DOM entanglements
	 * + The mediator reference to the model is released/nulled
	 * + Any value representation of this element mediator is released/nulled
	 * + The [[Mvvm|mvvm]] refernce is released/nulled
	 * + The parental reference is released/nulled
	 */
	public dispose(): void {
		this.removeDomListeners();
		this.unwire();
		this.____internal$$cydran____ = null;
		this.mediator = null;
	}

	/**
	 * Initialize this element mediator.
	 */
	public init(): void {
		this.wire();
	}

	/**
	 * Get the active module instance reference by id
	 * @return U
	 */
	public get<U>(id: string): U {
		requireValid(id, "id", VALID_ID);
		return this.____internal$$cydran____.module.get(id);
	}

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;
		this.pubSub.message(channelName, messageName, actualPayload);
	}

	/**
	 * Broadcast a message
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcast(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;
		this.getModule().broadcast(channelName, messageName, actualPayload);
	}

	/**
	 * Broadcast a message in the Global context
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;
		this.____internal$$cydran____.module.broadcastGlobally(channelName, messageName, actualPayload);
	}

	public on(messageName: string): OnContinuation {
		requireNotNull(messageName, "messageName");

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, "channelName");

				return {
					invoke: (target: (payload: any) => void) => {
						requireNotNull(target, "target");
						this.pubSub.on(messageName).forChannel(channelName).invoke((payload: any) => {
							target.apply(this, [payload]);
						});
					}
				};
			},
			invoke: (target: (payload: any) => void) => {
				requireNotNull(target, "target");
				this.pubSub.on(messageName).forChannel(INTERNAL_CHANNEL_NAME).invoke((payload: any) => {
					target.apply(this, [payload]);
				});
			}
		};
	}

	public isChildrenConsumable(): boolean {
		return this.childrenConsumable;
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		// Intentionally do nothing by default
	}

	public getParentId(): string {
		return this.____internal$$cydran____.mvvm.getId();
	}

	public getId(): string {
		return this.id;
	}

	public requestMediators(consumer: DigestionCandidateConsumer): void {
		// Intentionally do nothing by default
	}

	public hasPropagation(): boolean {
		return this.propagation;
	}

	public isTopLevelSupported(): boolean {
		return this.topLevelSupported;
	}

	protected disableChildConsumption(): void {
		this.childrenConsumable = false;
	}

	protected getExtractor(): AttributeExtractor {
		return this.____internal$$cydran____.mvvm.getExtractor();
	}

	protected getParams(): P {
		if (this.params === null) {
			this.params = extractAttributes<P>(this.getMediatorPrefix(), this.getEl() as HTMLElement);
		}

		return this.params;
	}

	protected getModelFn(): () => any {
		return this.____internal$$cydran____.mvvm.getModelFn();
	}

	protected getValueFn(): () => any {
		return this.____internal$$cydran____.mvvm.getItemFn();
	}

	protected bridge(name: string): void {
		requireNotNull(name, "name");

		const listener = (event: Event) => {
			this.message("dom", name, event);
		};

		if (!this.domListeners[name]) {
			this.domListeners[name] = listener;
			this.getEl().addEventListener(name, listener, false);
		}
	}

	/**
	 * Get the associated {HTMLElement html element} of this element mediator.
	 * @return {HTMLElement} [description]
	 */
	protected getEl(): E {
		return this.____internal$$cydran____.el as E;
	}

	/**
	 * [getModule description]
	 * @return {Module} [description]
	 */
	protected getModule(): Module {
		return this.____internal$$cydran____.module;
	}

	/**
	 * Gets the prefix of all Cydran attributes on the component.
	 * @return the prefix
	 */
	protected getPrefix(): string {
		return this.____internal$$cydran____.prefix;
	}

	/**
	 * Gets the prefix for the mediator.
	 * @return the mediator prefix
	 */
	protected getMediatorPrefix(): string {
		return this.____internal$$cydran____.mediatorPrefix;
	}

	/**
	 * [mediate description]
	 * @param  {string}        expression [description]
	 * @return {ModelMediator}            [description]
	 */
	protected mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T> {
		requireNotNull(expression, "expression");
		return this.____internal$$cydran____.mvvm.mediate(expression, reducerFn);
	}

	/**
	 * [getModel description]
	 * @return {any} [description]
	 */
	protected getModel(): any {
		return this.____internal$$cydran____.model;
	}

	/**
	 * [getParent description]
	 * @return {Component} [description]
	 */
	protected getParent(): Nestable {
		return this.____internal$$cydran____.parent.getComponent();
	}

	/**
	 * [getMediator description]
	 * @return {ModelMediator} [description]
	 */
	protected getModelMediator(): ModelMediator<M> {
		if (!isDefined(this.mediator)) {
			this.mediator = this.mediate(this.getExpression(), this.reducerFn);
		}

		return this.mediator;
	}

	protected $apply(fn: Function, args: any[]): any {
		requireNotNull(fn, "fn");
		requireNotNull(args, "args");

		if (this.____internal$$cydran____ && this.____internal$$cydran____.mvvm) {
			this.____internal$$cydran____.mvvm.$apply(fn, args);
		}
	}

	/**
	 * Get the expression specified
	 * @return {string} [description]
	 */
	protected getExpression(): string {
		return this.____internal$$cydran____.expression;
	}

	/**
	 * Gets the logger.
	 * @return {Logger} logger instance
	 */
	protected getLogger(): Logger {
		return this.logger;
	}

	/**
	 * Wire the element mediator
	 */
	protected abstract wire(): void;

	/**
	 * Unwire the element mediator
	 */
	protected abstract unwire(): void;

	protected abstract validate(element: E, check: (name: string, value?: any) => Validators): void;

	protected isMutable(): boolean {
		return this.____internal$$cydran____.mutable;
	}

	private removeDomListeners(): void {
		for (const name in this.domListeners) {
			if (!this.domListeners.hasOwnProperty(name)) {
				continue;
			}

			this.getEl().removeEventListener(name, this.domListeners[name]);
		}

		this.domListeners = {};
	}

}

class ModuleImpl implements Module, Register {

	public static readonly ALIASES: SimpleMap<string> = {};

	private name: string;

	private registry: RegistryImpl;

	private broker: Broker;

	private scope: ScopeImpl;

	private modules: ModulesContext;

	private properties: MutableProperties;

	constructor(name: string, modules: ModulesContext, scope: ScopeImpl, properties: MutableProperties) {
		this.properties = requireNotNull(properties, "properties");
		this.name = name;
		this.registry = new RegistryImpl(this);
		this.broker = new BrokerImpl();
		this.scope = new ScopeImpl();
		this.modules = modules;

		if (scope) {
			this.scope.setParent(scope);
		}
	}

	public getLogger(): Logger {
		return LoggerFactory.getLogger(this.name);
	}

	public getName(): string {
		return this.name;
	}

	public associate(...componentClasses: Type<Nestable>[]): Module {
		componentClasses.forEach((componentClass) => {
			requireNotNull(componentClass, "componentClass");
			componentClass["prototype"][MODULE_FIELD_NAME] = this;
		});

		return this;
	}

	public disassociate(...componentClasses: Type<Nestable>[]): Module {
		componentClasses.forEach((componentClass) => {
			requireNotNull(componentClass, "componentClass");
			componentClass["prototype"][MODULE_FIELD_NAME] = this;
		});

		return this;
	}

	public clear(): Module {
		return this;
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.broker.broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.modules.broadcast(channelName, messageName, payload);
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;

		if (channelName === INTERNAL_DIRECT_CHANNEL_NAME) {
			if (messageName === "addListener") {
				this.addListener(actualPayload as Listener);
			} else if (messageName === "removeListener") {
				this.removeListener(actualPayload as Listener);
			}
		}
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");

		let result: T = this.registry.get(id);

		if (!result) {
			result = this.modules.get(id);
		}

		return result;
	}

	public hasRegistration(id: string, moduleName?: string): boolean {
		const wkmod: Module = (moduleName) ? this.getModule(moduleName) : this.getDefaultModule();
		return wkmod.hasRegistration(id);
	}

	public getLocal<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		return this.registry.get(id);
	}

	public getModule(name: string): Module {
		return this.modules.getModule(name);
	}

	public getDefaultModule(): Module {
		return this.modules.getDefaultModule();
	}

	public getScope(): Scope {
		return this.scope;
	}

	public registerConstant(id: string, instance: any): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(instance, "instance");
		this.registry.registerConstant(id, instance);
		return this;
	}

	public registerConstantUnguarded(id: string, instance: any): Module {
		requireNotNull(id, "id");
		requireNotNull(instance, "instance");
		this.registry.registerConstantUnguarded(id, instance);
		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerPrototypeWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerSingletonWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public addStrategy(strategy: RegistryStrategy): Module {
		requireNotNull(strategy, "strategy");
		this.registry.addStrategy(strategy);
		return this;
	}

	public expose(id: string): Module {
		requireValid(id, "id", VALID_ID);
		ModuleImpl.ALIASES[id] = this.name;
		return this;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public createPubSubFor(context: any): PubSub {
		return new PubSubImpl(context, this);
	}

	private addListener(listener: Listener): void {
		this.broker.addListener(listener);
	}

	private removeListener(listener: Listener): void {
		this.broker.removeListener(listener);
	}

}

class ModulesContextImpl implements ModulesContext {

	public static getInstances(): ModulesContext[] {
		return ModulesContextImpl.INSTANCES;
	}

	public static resetInstances(): void {
		ModulesContextImpl.INSTANCES = [];
	}

	private static INSTANCES: ModulesContext[] = [];

	private readonly defaultModule: Module;

	private modules: SimpleMap<Module>;

	private rootScope: ScopeImpl;

	private rootproperties: MutableProperties;

	private properties: MutableProperties;

	constructor() {
		this.rootproperties = new PropertiesImpl();
		this.rootproperties.load(DEFAULT_PROPERTIES_VALUES);
		this.properties = this.rootproperties.extend() as MutableProperties;
		this.rootScope = new ScopeImpl(false);
		this.rootScope.add("compare", COMPARE);
		this.defaultModule = new ModuleImpl(DEFAULT_MODULE_KEY, this, this.rootScope, this.properties.extend());
		this.modules = {
			DEFAULT: this.defaultModule
		};

		ModulesContextImpl.INSTANCES.push(this);
	}

	public getModule(name: string): Module {
		requireValid(name, "name", VALID_ID);

		if (!this.modules[name]) {
			this.modules[name] = new ModuleImpl(name, this, this.defaultModule.getScope() as ScopeImpl, this.properties.extend());
		}

		return this.modules[name];
	}

	public getDefaultModule(): Module {
		return this.getModule(DEFAULT_MODULE_KEY);
	}

	public forEach(fn: (instace: Module) => void): void {
		requireNotNull(fn, "fn");

		for (const name in this.modules) {
			if (!this.modules.hasOwnProperty(name)) {
				continue;
			}

			const current: Module = this.modules[name];

			fn(current);
		}
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.forEach((instance) => instance.broadcast(channelName, messageName, payload));
	}

	public registerConstant(id: string, instance: any): void {
		this.getDefaultModule().registerConstant(id, instance);
	}

	public registerConstantUnguarded(id: string, instance: any): void {
		(this.getDefaultModule() as ModuleImpl).registerConstantUnguarded(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, dependencies: string[]): void {
		this.getDefaultModule().registerPrototype(id, classInstance, dependencies);
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void {
		this.getDefaultModule().registerPrototypeWithFactory(id, factoryFn, dependencies);
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies: string[]): void {
		this.getDefaultModule().registerSingleton(id, classInstance, dependencies);
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void {
		this.getDefaultModule().registerSingletonWithFactory(id, factoryFn, dependencies);
	}

	public registerElementMediator(
		name: string,
		supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): void {
		Factories.register(name, supportedTags, elementMediatorClass);
	}

	public getScope(): Scope {
		return this.getDefaultModule().getScope();
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");

		let result: T = null;

		const moduleId: string = ModuleImpl.ALIASES[id];

		if (moduleId) {
			result = this.getModule(id).getLocal(id);
		}

		if (!result) {
			result = this.defaultModule.getLocal(id);
		}

		return result;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public dispose(): void {
		const index: number = ModulesContextImpl.INSTANCES.indexOf(this);

		if (index > -1) {
			ModulesContextImpl.INSTANCES.splice(index, 1);
		}
	}

}

class AttributeExtractorImpl implements AttributeExtractor {

	private prefix: string;

	private eventPrefix: string;

	constructor(prefix: string) {
		this.prefix = requireNotNull(prefix, "prefix") + ":";
		this.eventPrefix = this.prefix + "on";
	}

	public extract(element: HTMLElement, name: string): string {
		return extractAttribute(element, this.prefix, name);
	}

	public remove(element: HTMLElement, name: string): void {
		element.removeAttribute(this.prefix + name);
	}

	public isEventAttribute(name: string): boolean {
		return (name.indexOf(this.eventPrefix) === 0);
	}

	public isMediatorAttribute(name: string): boolean {
		return (name.indexOf(this.prefix) === 0);
	}

	public extractEventName(name: string): string {
		return name.substr(this.eventPrefix.length);
	}

	public extractMediatorName(name: string): string {
		return name.substr(this.prefix.length);
	}

	public asTypePrefix(name: string): string {
		return this.prefix + name;
	}

	public getPrefix(): string {
		return this.prefix;
	}

}

class DigesterImpl implements Digester {

	public static readonly DIGESTION_START_HOOKS: EventHooks<Nestable> = new EventHooksImpl();

	public static readonly DIGESTION_END_HOOKS: EventHooks<Nestable> = new EventHooksImpl();

	public static readonly DIGESTION_CYCLE_START_HOOKS: EventHooks<Nestable> = new EventHooksImpl();

	private logger: Logger;

	private nameFn: () => string;

	private messagableSourceFn: () => Messagable[];

	private rootMediatorSource: MediatorSource;

	private skipableIds: string[];

	private maxEvaluations: number;

	constructor(rootMediatorSource: MediatorSource, id: string, nameFn: () => string, messagableSourceFn: () => Messagable[], maxEvaluations: number) {
		this.skipableIds = [];
		this.rootMediatorSource = requireNotNull(rootMediatorSource, "rootMediatorSource");
		this.nameFn = requireNotNull(nameFn, "nameFn");
		this.messagableSourceFn = requireNotNull(messagableSourceFn, "messagableSourceFn");
		this.logger = LoggerFactory.getLogger("Digester " + id);
		this.maxEvaluations = requireNotNull(maxEvaluations, "maxEvaluations");
	}

	public skipId(id: string): void {
		if (id !== null && id !== undefined) {
			this.skipableIds.push(id);
		}
	}

	public digest(): void {
		DigesterImpl.DIGESTION_START_HOOKS.notify(this.rootMediatorSource as unknown as Nestable);
		this.logger.ifTrace(() => `Started digest on ${ this.nameFn() }`);
		let remainingEvaluations: number = this.maxEvaluations;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			DigesterImpl.DIGESTION_CYCLE_START_HOOKS.notify(this.rootMediatorSource as unknown as Nestable);
			this.logger.trace("Top digest loop");
			remainingEvaluations--;

			const context: DigestionContext = new DigestionContextImpl();
			this.populate(context);

			const changedMediators: Notifyable[] = context.digest();

			if (changedMediators.length === 0) {
				pending = false;
				this.logger.trace("Nothing to notify");
				break;
			}

			for (const changedMediator of changedMediators) {
				changedMediator.notify();
			}

			this.logger.trace("End digest loop");
		}

		DigesterImpl.DIGESTION_END_HOOKS.notify(this.rootMediatorSource as unknown as Nestable);
	}

	private populate(context: DigestionContext): void {
		const seen: SimpleMap<boolean> = {};
		const sources: MediatorSource[] = [];

		while (this.skipableIds.length > 0) {
			const skipableId: string = this.skipableIds.pop();

			if (skipableId !== null) {
				seen[skipableId] = true;
			}
		}

		sources.push(this.rootMediatorSource);

		const messagables: Messagable[] = this.messagableSourceFn();

		for (const component of messagables) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		while (sources.length > 0) {
			const source: MediatorSource = sources.pop();
			const id: string = source.getId();

			if (id !== null && seen[id]) {
				continue;
			}

			seen[id] = true;
			source.requestMediatorSources(sources);
			source.requestMediators(context);
		}
	}

}

class DigestionContextImpl implements DigestionContext {

	private readonly logger: Logger = LoggerFactory.getLogger("DigestionContextImpl");

	private mediators: SimpleMap<DigestionCandidate[]>;

	constructor() {
		this.mediators = {};
	}

	public add(key: string, mediators: DigestionCandidate[]): void {
		if (!this.mediators[key]) {
			this.mediators[key] = [];

			for (const mediator of mediators) {
				this.mediators[key].push(mediator);
			}
		}
	}

	public digest(): Notifyable[] {
		const changedMediators: DigestionCandidate[] = [];

		for (const key in this.mediators) {
			if (!this.mediators.hasOwnProperty(key)) {
				continue;
			}

			const current: DigestionCandidate[] = this.mediators[key];
			this.digestSegment(changedMediators, current);
		}

		return changedMediators;
	}

	private digestSegment(changedMediators: DigestionCandidate[], mediators: DigestionCandidate[]): void {
		for (const mediator of mediators) {
			let changed: boolean = false;

			try {
				changed = mediator.evaluate();
			} catch (e) {
				this.logger.error(`Error evaluating mediator: ${ mediator.constructor.name } - ${ mediator.getExpression() }`);
				throw e;
			}

			if (changed) {
				changedMediators.push(mediator);
			}
		}
	}

}

class Factories {

	public static register(name: string, supportedTags: string[], elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(elementMediatorClass, "elementMediatorClass");

		if (!Factories.factories[name]) {
			Factories.factories[name] = {};
		}

		for (const supportedTag of supportedTags) {
			Factories.factories[name][supportedTag] = elementMediatorClass;
		}
	}

	public static get<T>(type: string): T {
		return (Factories.factories[type] as any) as T;
	}

	private static factories: SimpleMap<SimpleMap<new () => any>> = {};

}

class RegionVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const extractor: AttributeExtractor = context.getExtractor();
		const name: string = extractor.extract(element, Attrs.NAME);

		if (isDefined(name)) {
			requireValid(name, extractor.asTypePrefix(Attrs.NAME), VALID_KEY);
		}

		const validator: Validator = new ValidatorImpl();
		const check: (name: string, value?: any) => Validators = validator.getFunction();
		check(extractor.asTypePrefix(Attrs.NAME), extractor.extract(element, Attrs.NAME)).matches(VALID_KEY);
		check(extractor.asTypePrefix(Attrs.COMPONENT), extractor.extract(element, Attrs.COMPONENT)).matches(VALID_ID);
		check(extractor.asTypePrefix(Attrs.COMPONENT), extractor.extract(element, Attrs.MODULE)).matches(VALID_ID);

		validator.throwIfErrors(() => `Invalid use of cydran/region on element ${ elementAsString(element) }`);

		const componentName: string = extractor.extract(element, Attrs.COMPONENT);
		const moduleName: string = extractor.extract(element, Attrs.MODULE);
		const regionName: string = isDefined(name) ? name : context.createRegionName();
		const valueExpression: string = extractor.extract(element, Attrs.VALUE);
		const lockedAttr: string = extractor.extract(element, Attrs.LOCK);
		const explicitlyLocked: boolean = isDefined(lockedAttr) && lockedAttr.toLowerCase() === "true";
		const implicitlyLocked: boolean = isDefined(componentName) && componentName !== "" && !isDefined(name);
		const locked: boolean = explicitlyLocked || implicitlyLocked;
		const region: RegionImpl = context.addRegion(regionName, element, locked) as RegionImpl;

		region.setExpression(valueExpression);

		if (isDefined(componentName) && componentName !== "") {
			region.setInitialComponentFn(() => {
				const moduleToUse: Module = isDefined(moduleName) ? context.getModule().getModule(moduleName) : context.getModule();
				const component: Nestable = isDefined(moduleToUse) ? moduleToUse.get(componentName) : context.getModule().get(componentName);

				if (!isDefined(component)) {
					const componentClassName: string = context.getParent().getComponent().constructor.name;
					throw new UnknownComponentError(`Unknown component ${ componentName } referenced in component ${ componentClassName }`);
				}

				return component;
			});
		}
	}

}

const VISITORS: SimpleMap<ElementVisitor<HTMLScriptElement, any>> = {
	region: new RegionVisitor()
};

class AttributeElementMediator extends AbstractElementMediator<string, HTMLElement, any> {

	private attributeName: string;

	constructor(dependencies: any) {
		super(dependencies, false, asString);
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public populate(): void {
		this.getEl().setAttribute(this.attributeName, this.getModelMediator().get());
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public setAttributeName(attributeName: string): void {
		this.attributeName = attributeName;
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().setAttribute(this.attributeName, current);
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

class EventElementMediator extends AbstractElementMediator<any, HTMLElement, any> {

	private eventKey: string;

	constructor(dependencies: any) {
		super(dependencies, false, asIdentity);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleEvent(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().invoke({
				$event: event
			});
		}, [event]);
	}

	public wire(): void {
		this.bridge(this.eventKey);
		this.on(this.eventKey).forChannel("dom").invoke(this.handleEvent);
	}

	public setEventKey(eventKey: string): void {
		this.eventKey = eventKey;
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

/**
 * Core class for Cydran
 */
class Component implements Nestable {

	// tslint:disable-next-line
	private ____internal$$cydran____: ComponentInternals;

	// tslint:disable-next-line
	private ____internal$$cydran$$module____: any;

	/**
	 * Constructor
	 * @param template - string value representation of a template
	 * @param config - optional {@link ComponentConfig} argument
	 */
	constructor(template: string | HTMLElement | Renderer, options?: ComponentOptions) {
		this.____internal$$cydran$$init____(template, options as InternalComponentOptions);
	}

	/**
	 * Get the {@link MetadataContinuation} of the {@link Component}
	 */
	public metadata(): MetadataContinuation {
		const internal: ComponentInternals = this.____internal$$cydran____;

		return {
			get: (name: string) => internal.getMetadata(name),
			has: (name: string) => internal.hasMetadata(name)
		};
	}

	/**
	 * Component has a {@link Region}
	 * @returns boolean - true | false
	 */
	public hasRegion(name: string): boolean {
		return this.____internal$$cydran____.hasRegion(name);
	}

	/**
	 * Get a child component from a region.
	 * @param name - string name value of the child {@link Component}
	 * @returns Component instance, or null
	 */
	public getChild<N extends Nestable>(name: string): N {
		return this.____internal$$cydran____.getChild(name);
	}

	/**
	 * Set a child component into a region.
	 * @param name - string name value of the child {@link Component}
	 * @param component - the {@link Component} reference
	 */
	public setChild(name: string, component: Nestable): void {
		this.____internal$$cydran____.setChild(name, component);
	}

	public setChildFromRegistry(name: string, componentName: string, defaultComponentName?: string): void {
		this.____internal$$cydran____.setChildFromRegistry(name, componentName, defaultComponentName);
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.message(channelName, messageName, payload);
	}

	public dispose(): void {
		this.____internal$$cydran____.dispose();
	}

	public getParent(): Nestable {
		return this.____internal$$cydran____.getParent();
	}

	public getEl(): HTMLElement {
		return this.____internal$$cydran____.getEl();
	}

	public get<T>(id: string): T {
		return this.____internal$$cydran____.get(id);
	}

	public scope(): Scope {
		return this.____internal$$cydran____.getScope();
	}

	public getPrefix(): string {
		return this.____internal$$cydran____.getPrefix();
	}

	public isConnected(): boolean {
		return this.____internal$$cydran____.isConnected();
	}

	public getId(): string {
		return this.____internal$$cydran____.getId();
	}

	public forElement<E extends HTMLElement>(name: string): NamedElementOperations<E> {
		return this.____internal$$cydran____.forElement(name);
	}

	public watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void {
		this.____internal$$cydran____.watch(expression, target, reducerFn, context);
	}

	public evaluate<T>(expression: string): T {
		return this.____internal$$cydran____.evaluate(expression);
	}

	public getWatchContext(): any {
		return this.____internal$$cydran____.getWatchContext();
	}

	public getProperties(): Properties {
		return this.____internal$$cydran____.getModule().getProperties();
	}

	protected getValue<T>(): T {
		return this.____internal$$cydran____.getData() as T;
	}

	protected broadcast(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.broadcast(channelName, messageName, payload);
	}

	protected broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.broadcastGlobally(channelName, messageName, payload);
	}

	protected $apply(fn?: Function, args?: any[]): void {
		this.____internal$$cydran____.$apply(fn, args);
	}

	protected on(messageName: string): OnContinuation {
		requireNotNull(messageName, "messageName");

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, "channelName");

				return {
					invoke: (target: (payload: any) => void) => {
						requireNotNull(target, "target");
						this.____internal$$cydran____.on(target, messageName, channelName);
					}
				};
			},
			invoke: (target: (payload: any) => void) => {
				requireNotNull(target, "target");
				this.____internal$$cydran____.on(target, messageName, INTERNAL_CHANNEL_NAME);
			}
		};
	}

	protected getLogger(): Logger {
		return this.____internal$$cydran____.getLogger();
	}

	protected ____internal$$cydran$$init____(template: string | HTMLElement | Renderer, options: InternalComponentOptions): void {
		this.____internal$$cydran____ = new ComponentInternalsImpl(this, template, options);
		this.____internal$$cydran____.init();
	}

}

const DEFAULT_COMPONENT_OPTIONS: InternalComponentOptions = {
	prefix: "c",
	itemFn: EMPTY_OBJECT_FN,
	parentModelFn: null,
	metadata: {},
	repeatable: false,
	alwaysConnected: false
};

class ComponentInternalsImpl implements ComponentInternals {

	private id: string;

	private component: Nestable;

	private logger: Logger;

	private el: HTMLElement;

	private regions: { [id: string]: RegionImpl; };

	private regionsAsArray: Region[];

	private parent: Nestable;

	private mvvm: Mvvm;

	private pubSub: PubSub;

	private scope: ScopeImpl;

	private options: InternalComponentOptions;

	private parentSeen: boolean;

	private renderer: Renderer;

	constructor(component: Nestable, template: string | HTMLElement | Renderer, options: InternalComponentOptions) {
		requireNotNull(template, "template");

		const templateType: string = typeof template;

		if (templateType === "string") {
			this.renderer = new StringRendererImpl(template as string);
		} else if (templateType === "object" && isDefined(template["render"])) { // TODO - Explicitly check for if it is a function
			this.renderer = template as Renderer;
		} else if (template instanceof HTMLElement) { // TODO - Correctly check for HTMLElement
			this.renderer = new IdentityRendererImpl(template as HTMLElement);
		} else {
			throw new TemplateError("Template must be a string, HTMLElement or Renderer - " + templateType);
		}

		this.parentSeen = false;
		this.id = IdGenerator.INSTANCE.generate();
		this.options = merge(
			[DEFAULT_COMPONENT_OPTIONS, options],
			{
				metadata: (existingValue: any, newValue: any) => merge([existingValue, newValue])
			}
		);

		// this.message(INTERNAL_DIRECT_CHANNEL_NAME, "skipId", parentId);


		this.options.prefix = this.options.prefix.toLowerCase();
		this.parent = null;

		this.validateOptions();
		this.component = component;
		this.scope = new ScopeImpl();

		if (isDefined(this.options.module)) {
			this.component[MODULE_FIELD_NAME] = this.options.module;
		} else {
			this.validateModulePresent();
		}

		if (this.getModule()) {
			this.scope.setParent(this.getModule().getScope() as ScopeImpl);
		}

		this.regions = {};
		this.regionsAsArray = [];
		this.pubSub = new PubSubImpl(this.component, this.getModule());
	}

	public init(): void {
		this.mvvm = new MvvmImpl(this.id, this.component, this.getModule(), this.options.prefix, this.scope, this.options.parentModelFn);
		this.logger = LoggerFactory.getLogger(`${ this.component.constructor.name } Component ${ this.mvvm.getId() }`);
		this.render();
		this.mvvm.init(this.el, this, (name: string, element: HTMLElement, locked: boolean) => this.addRegion(name, element, locked));

		if (isDefined(this.options.skipId)) {
			this.mvvm.skipId(this.options.skipId);
		}

		for (const key in this.regions) {
			if (!this.regions.hasOwnProperty(key)) {
				continue;
			}

			const region: RegionImpl = this.regions[key];
			region.populate();
		}

		if (isDefined(this.options.parent)) {
			this.setParent(this.options.parent);
		}
	}

	public hasMetadata(name: string): boolean {
		return this.getMetadata(name) ? true : false;
	}

	public getMetadata(name: string): any {
		requireNotNull(name, "name");

		return this.options.metadata[name];
	}

	public hasRegion(name: string): boolean {
		requireNotNull(name, "name");
		return ((this.regions[name]) ? true : false);
	}

	public $apply(fn: Function, args: any[]): void {
		const actualFn: Function = fn || NO_OP_FN;
		const actualArgs = args || [];

		if (this.parentSeen) {
			this.mvvm.$apply(actualFn, actualArgs);
		} else {
			actualFn.apply(this.component, actualArgs);
		}
	}

	public evaluate<T>(expression: string): T {
		return new Getter<T>(expression).get(this.mvvm.getScope() as ScopeImpl) as T;
	}

	public getChild<N extends Nestable>(name: string): N {
		requireNotNull(name, "name");

		return this.hasRegion(name) ? this.getRegion(name).getComponent() : null;
	}

	public setChild(name: string, component: Nestable): void {
		requireNotNull(name, "name");

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError(`Region '${ name }' is unknown and must be declared in component template.`);
		}

		const hasComponent: boolean = this.getRegion(name).hasComponent();
		const childAdded: boolean = !!(component !== null && !hasComponent);
		const childRemoved: boolean = !!(component === null && hasComponent);
		this.messageInternalIf(childAdded, Events.BEFORE_CHILD_ADDED, { name: name });
		this.messageInternalIf(childRemoved, Events.BEFORE_CHILD_REMOVED, { name: name });
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_CHANGED, { name: name });
		this.getRegion(name).setComponent(component);
		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_CHANGED, { name: name });
		this.messageInternalIf(childAdded, Events.AFTER_CHILD_ADDED, { name: name });
		this.messageInternalIf(childRemoved, Events.AFTER_CHILD_REMOVED, { name: name });
		this.broadcastGlobally(INTERNAL_CHANNEL_NAME, Events.COMPONENT_NESTING_CHANGED);
	}

	public setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void {
		requireNotNull(name, "name");
		requireValid(componentId, "componentId", VALID_ID);

		if (!this.hasRegion(name)) {
			throw new UnknownRegionError(`Region '${ name }' is unknown and must be declared in component template.`);
		}

		let component: Nestable = this.get(componentId);

		if (!component && defaultComponentName) {
			component = this.get(defaultComponentName);
		}

		if (component) {
			this.setChild(name, component);
		} else {
			const error = new SetComponentError(`Unable to set component ${ componentId } on region ${ name }`);
			this.getLogger().error(error);
		}
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (channelName !== INTERNAL_DIRECT_CHANNEL_NAME) {
			this.pubSub.message(channelName, messageName, payload);

			return;
		}

		switch (messageName) {
			case "setMode":
				switch (payload) {
					case "repeatable":
						this.options.repeatable = true;
						break;

					default:
						this.options.repeatable = false;
				}
				break;

			case "consumeRegionDigestionCandidates":
				for (const region of this.regionsAsArray) {
					if (region.hasExpression() && region.hasComponent()) {
						region.getComponent().message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", payload);
					}
				}

				break;

			case "consumeDigestionCandidates":
				(payload as MediatorSource[]).push(this.mvvm);
				break;

			case NESTING_CHANGED:
				this.nestingChanged();
				break;

			case "digest":
				this.digest();
				break;

			case "setParent":
				this.setParent(payload as Nestable);
				break;

			case "skipId":
				this.mvvm.skipId(payload as string);
				break;

			case "setItemFn":
				this.setItemFn(payload);
				break;

			default:
				this.logger.warn(`Unsupported internal message: ${ messageName }`);
		}
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.getModule().broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getModule().broadcastGlobally(channelName, messageName, payload);
	}

	public dispose(): void {
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_DISPOSE, {});
		this.pubSub.dispose();
		this.parent = null;
		this.scope = null;
		this.regions = null;
		this.regionsAsArray = [];
	}

	public getEl(): HTMLElement {
		return this.el;
	}

	public getComponent(): Nestable {
		return this.component;
	}

	public get<T>(id: string): T {
		return this.getModule().get(id);
	}

	public getPrefix(): string {
		return this.options.prefix;
	}

	public isConnected(): boolean {
		return this.options.alwaysConnected || (this.parent !== null && this.parent !== undefined && this.parent.isConnected());
	}

	public isRepeatable(): boolean {
		return this.options.repeatable;
	}

	public getScope(): Scope {
		return this.scope;
	}

	public watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void {
		requireNotNull(expression, "expression");
		requireNotNull(target, "target");
		const actualContext: any = isDefined(context) ? context : this.component;
		this.mvvm.mediate(expression, reducerFn).watch(actualContext, target);
	}

	public on(target: (payload: any) => void, messageName: string, channel?: string): void {
		this.pubSub.on(messageName).forChannel(channel || INTERNAL_CHANNEL_NAME).invoke((payload: any) => this.$apply(target, [payload]));
	}

	public forElement<E extends HTMLElement>(name: string): NamedElementOperations<E> {
		requireNotNull(name, "name");
		const element: E = this.mvvm.getNamedElement(name) as E;

		if (!isDefined(element)) {
			throw new UnknownElementError("Unknown element: " + name);
		}

		return new NamedElementOperationsImpl<E>(element);
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public getModule(): Module {
		return this.component[MODULE_FIELD_NAME] as Module;
	}

	public getParent(): Nestable {
		return this.parent;
	}

	public setItemFn(itemFn: () => any): void {
		this.options.itemFn = isDefined(itemFn) ? itemFn : EMPTY_OBJECT_FN;
	}

	public getData(): any {
		return this.options.itemFn();
	}

	public getId(): string {
		return this.id;
	}

	public getWatchContext(): any {
		return this.mvvm.getScope();
	}

	protected getOptions(): InternalComponentOptions {
		return this.options;
	}

	protected addRegion(name: string, element: HTMLElement, locked: boolean): Region {
		if (!this.regions[name]) {
			const created: RegionImpl = new RegionImpl(name, this, element, locked);
			this.regions[name] = created;
			this.regionsAsArray.push(created);
		}

		return this.regions[name];
	}

	protected getRegion(name: string): Region {
		return this.regions[name];
	}

	protected render(): void {
		this.el = this.renderer.render();

		if (this.el.tagName.toLowerCase() === "script") {
			throw new TemplateError("Component template must not use a script tag as top-level element in component "
				+ this.component.constructor.name);
		}
	}

	protected setEl(el: HTMLElement): void {
		this.el = el;
	}

	protected validateModulePresent(): void {
		const moduleInstance: Module = this.component[MODULE_FIELD_NAME] as Module;

		if (!isDefined(moduleInstance)) {
			if (ModulesContextImpl.getInstances().length === 0) {
				throw new ModuleAffinityError(`Component ${ this.component.constructor.name } does not have affinity with a module and no stages are active.  Unable to determine component affinity`);
			} else if (ModulesContextImpl.getInstances().length === 1) {
				this.component[MODULE_FIELD_NAME] = ModulesContextImpl.getInstances()[0].getDefaultModule();
			} else {
				throw new ModuleAffinityError(`Component ${ this.component.constructor.name } does not have affinity with a module and multiple stages are active.  Unable to determine component affinity`);
			}
		}
	}

	private validateOptions(): void {
		// TODO - Implement
	}

	private messageInternalIf(condition: boolean, messageName: string, payload?: any): void {
		if (condition) {
			this.message(INTERNAL_CHANNEL_NAME, messageName, payload);
		}
	}

	private messageChildren(channelName: string, messageName: string, payload?: any): void {
		for (const id in this.regions) {
			if (!this.regions.hasOwnProperty(id)) {
				continue;
			}

			this.regions[id].message(channelName, messageName, payload);
		}
	}

	private setParent(parent: Nestable): void {
		this.parentSeen = true;
		const changed: boolean = this.bothPresentButDifferent(parent, this.parent) || this.exactlyOneDefined(parent, this.parent);
		const parentAdded: boolean = !!(parent !== null && this.parent === null);
		const parentRemoved: boolean = !!(parent === null && this.parent !== null);
		this.messageInternalIf(parentAdded, Events.BEFORE_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.BEFORE_PARENT_REMOVED, {});
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_CHANGED, {});
		this.parent = parent;

		if (changed) {
			this.nestingChanged();
		}

		if (isDefined(this.parent)) {
			this.digest();
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_CHANGED, {});
		this.messageInternalIf(parentAdded, Events.AFTER_PARENT_ADDED, {});
		this.messageInternalIf(parentRemoved, Events.AFTER_PARENT_REMOVED, {});
	}

	private nestingChanged(): void {
		if (this.isConnected() && !this.pubSub.isGlobalEnabled()) {
			this.pubSub.enableGlobal();
		} else if (!this.isConnected() && this.pubSub.isGlobalEnabled()) {
			this.pubSub.disableGlobal();
		}

		this.mvvm.nestingChanged();
		this.messageChildren(INTERNAL_DIRECT_CHANNEL_NAME, NESTING_CHANGED);
	}

	private digest(): void {
		this.$apply(NO_OP_FN, []);
	}

	private bothPresentButDifferent(first: Nestable, second: Nestable): boolean {
		return isDefined(first) && isDefined(second) && first.getId() !== second.getId();
	}

	private exactlyOneDefined(first: any, second: any): boolean {
		return isDefined(first) ? !isDefined(second) : isDefined(second);
	}

}

class IdentityRendererImpl implements Renderer {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public render(): HTMLElement {
		return this.element;
	}

}

class NamedElementOperationsImpl<E extends HTMLElement> implements NamedElementOperations<E> {

	private element: E;

	constructor(element: E) {
		this.element = element;
	}

	public get(): E {
		return this.element;
	}

	public focus(): void {
		setTimeout(() => {
			this.element.focus();
		}, 1);
	}

	public blur(): void {
		setTimeout(() => {
			this.element.blur();
		}, 1);
	}

}

class RegionImpl implements Region {

	private logger: Logger;

	private component: Nestable;

	private parent: ComponentInternals;

	private name: string;

	private itemFn: () => any;

	private expression: string;

	private initialComponentFn: () => Nestable;

	private locked: boolean;

	private element: ElementReference<HTMLElement>;

	constructor(name: string, parent: ComponentInternals, element: HTMLElement, locked: boolean) {
		this.logger = LoggerFactory.getLogger(`Region ${ this.name } for ${ parent.getId() }`);
		this.locked = requireNotNull(locked, "locked");
		this.itemFn = EMPTY_OBJECT_FN;
		this.component = null;
		this.parent = parent;
		this.name = name;
		this.expression = null;
		this.element = new ElementReferenceImpl<HTMLElement>(element, "Empty");
	}

	public populate(): void {
		if (isDefined(this.initialComponentFn)) {
			this.setComponent(this.initialComponentFn());
			this.initialComponentFn = null;
		}
	}

	public hasExpression(): boolean {
		return isDefined(this.expression);
	}

	public setExpression(expression: string): void {
		this.itemFn = isDefined(expression)
			? () => this.parent.evaluate(expression)
			: EMPTY_OBJECT_FN;

		this.expression = expression;

		this.syncComponentMode();
	}

	public getComponent<N extends Nestable>(): N {
		return this.component as N;
	}

	public setComponent(component: Nestable): void {
		if (isDefined(this.component) && this.locked) {
			throw new LockedRegionError(`Region ${ this.name } is locked and can not be updated`);
		}

		if (this.component === component) {
			this.logger.trace("Component unchanged, so not setting.");
			return;
		}

		if (isDefined(component)) {
			this.logger.ifTrace(() => "Setting component " + component.getId());
		}

		if (isDefined(this.component)) {
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setItemFn", EMPTY_OBJECT_FN);
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "");
		}

		if (isDefined(component)) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setItemFn", this.itemFn);
		}

		if (isDefined(component) && !isDefined(this.component)) {
			// Component being set, no existing component
			this.component = component;
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		} else if (!isDefined(component) && isDefined(this.component)) {
			// Component being nulled, existing component present
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			this.component = null;
		} else if (isDefined(component) && isDefined(this.component)) {
			// Component being set, existing component present
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			this.component = component;
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		}

		const replacementElement: HTMLElement = isDefined(this.component) ? this.component.getEl() : null;
		this.element.set(replacementElement);

		this.syncComponentMode();
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (isDefined(this.component)) {
			this.component.message(channelName, messageName, payload);
		}
	}

	public hasComponent(): boolean {
		return isDefined(this.component);
	}

	public dispose() {
		if (isDefined(this.component)) {
			this.component.dispose();
		}

		this.setComponent(null);
	}

	public setInitialComponentFn(initialComponentFn: () => Nestable): void {
		this.initialComponentFn = initialComponentFn;
	}

	private syncComponentMode(): void {
		if (isDefined(this.component)) {
			if (isDefined(this.expression)) {
				this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
			} else {
				this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "");
			}
		}
	}

}

class StringRendererImpl implements Renderer {

	private template: string;

	constructor(template: string) {
		this.template = requireNotNull(template, "template").trim();
	}

	public render(): HTMLElement {
		const templateEl: HTMLTemplateElement = createElementOffDom("template");
		templateEl.insertAdjacentHTML("afterbegin", this.template.trim());

		if (templateEl.childElementCount !== 1) {
			throw new TemplateError(`Component template must have a single top level element, but had ${ templateEl.childElementCount } top level elements:\n\n${ this.template }\n\n`);
		}

		return templateEl.firstElementChild as HTMLElement;
	}

}

class MvvmImpl implements Mvvm {

	private el: HTMLElement;

	private elementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private mediators: ModelMediatorImpl<any>[];

	private propagatingElementMediators: ElementMediator<any, HTMLElement | Text, any>[];

	private model: any;

	private parent: ComponentInternals;

	private moduleInstance: Module;

	private components: Nestable[];

	private scope: ScopeImpl;

	private id: string;

	private namedElements: SimpleMap<HTMLElement>;

	private regionAddFn: (name: string, element: HTMLElement, locked: boolean) => RegionImpl;

	private modelFn: () => any;

	private itemFn: () => any;

	private digester: Digester;

	private anonymousRegionNameIndex: number;

	private extractor: AttributeExtractor;

	private validated: boolean;

	private cloneDepth: number;

	private equalsDepth: number;

	private mediatorsInitialized: boolean;

	constructor(id: string, model: any, moduleInstance: Module, prefix: string, scope: ScopeImpl, parentModelFn: () => any) {
		this.id = requireNotNull(id, "id");
		this.extractor = new AttributeExtractorImpl(prefix);
		this.anonymousRegionNameIndex = 0;
		this.propagatingElementMediators = [];
		this.scope = new ScopeImpl(false);
		this.scope.setParent(scope);
		this.elementMediators = [];
		this.namedElements = {};
		this.mediators = [];
		this.model = model;
		this.moduleInstance = moduleInstance;
		this.validated = this.moduleInstance.getProperties().isTruthy(PropertyKeys.CYDRAN_DEVELOPMENT_ENABLED);
		this.components = [];
		this.mediatorsInitialized = false;
		const maxEvaluations: number = moduleInstance.getProperties().get(PropertyKeys.CYDRAN_DIGEST_MAX_EVALUATIONS);
		const configuredCloneDepth: number = moduleInstance.getProperties().get(PropertyKeys.CYDRAN_CLONE_MAX_EVALUATIONS);
		const configuredEqualsDepth: number = moduleInstance.getProperties().get(PropertyKeys.CYDRAN_EQUALS_MAX_EVALUATIONS);
		this.cloneDepth = isDefined(configuredCloneDepth) ? configuredCloneDepth : DEFAULT_CLONE_DEPTH;
		this.equalsDepth = isDefined(configuredEqualsDepth) ? configuredEqualsDepth : DEFAULT_EQUALS_DEPTH;
		this.digester = new DigesterImpl(this, this.id, () => this.parent.getComponent().constructor.name, () => this.components,
			maxEvaluations);

		const localModelFn: () => any = () => this.model;
		this.modelFn = parentModelFn ? parentModelFn : localModelFn;
		this.itemFn = () => this.parent.getData();

		this.scope.add("m", this.modelFn);
		this.scope.add("v", this.itemFn);
	}

	public init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => RegionImpl): void {
		this.el = el;
		this.parent = parent;
		this.regionAddFn = regionAddFn;
		this.validateEl();
		WALKER.walk(this.el, this);
	}

	public nestingChanged(): void {
		for (const elementMediator of this.elementMediators) {
			elementMediator.message(INTERNAL_DIRECT_CHANNEL_NAME, NESTING_CHANGED);
		}

		for (const component of this.components) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, NESTING_CHANGED);
		}
	}

	public dispose(): void {
		for (const elementMediator of this.elementMediators) {
			elementMediator.dispose();
		}

		this.elementMediators = [];
		this.components = [];

		for (const component of this.components) {
			component.dispose();
		}

		this.parent = null;
		this.namedElements = null;
	}

	public getId(): string {
		return this.id;
	}

	public getNamedElement<E extends HTMLElement>(name: string): E {
		const element: E = this.namedElements[name] as E;
		return (element === undefined) ? null : element;
	}

	public mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T> {
		const mediator: ModelMediator<T> = new ModelMediatorImpl<T>(this.model, expression, this.scope, reducerFn,
			(value: any) => clone(this.cloneDepth, value), (first: any, second: any) => equals(this.equalsDepth, first, second));
		this.mediators.push(mediator as ModelMediatorImpl<any>);

		return mediator;
	}

	public getScope(): ScopeImpl {
		return this.scope;
	}

	public digest(): void {
		if (!this.mediatorsInitialized) {
			for (const elementMediator of this.elementMediators) {
				elementMediator.populate();
			}

			this.mediatorsInitialized = true;
		}

		if (this.parent.isRepeatable()) {
			this.parent.getParent().message(INTERNAL_DIRECT_CHANNEL_NAME, "digest");
		} else {
			this.digester.digest();
		}
	}

	public requestMediators(consumer: DigestionCandidateConsumer): void {
		consumer.add(this.getId(), this.mediators);
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		if (this.parent.isRepeatable()) {
			if (isDefined(this.parent.getParent())) {
				this.parent.getParent().message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
			}
		}

		this.parent.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeRegionDigestionCandidates", sources);

		for (const source of this.propagatingElementMediators) {
			sources.push(source);
		}
	}

	public getParent(): ComponentInternals {
		return this.parent;
	}

	public getExtractor(): AttributeExtractor {
		return this.extractor;
	}

	public $apply(fn: Function, args: any[]): any {
		const result: any = fn.apply(this.model, args);
		this.digest();

		return result;
	}

	public getModelFn(): () => any {
		return this.modelFn;
	}

	public getModule(): Module {
		return this.moduleInstance;
	}

	public getItemFn(): () => any {
		return this.itemFn;
	}

	public skipId(id: string): void {
		this.digester.skipId(id);
	}

	public getMessagables(): Messagable[] {
		return this.components;
	}

	public getModel(): any {
		return this.model;
	}

	private validateEl(): void {
		if (this.el.tagName.toLowerCase() === "script") {
			throw new TemplateError("Templates must not have a script tag as the top level tag.");
		}
	}

	public addRegion(name: string, element: HTMLElement, locked: boolean): Region {
		return this.regionAddFn(name, element, locked);
	}

	public createRegionName(): string {
		const name: string = ANONYMOUS_REGION_PREFIX + this.anonymousRegionNameIndex;
		++this.anonymousRegionNameIndex;

		return name;
	}

	public addMediator(mediator: any): void {
		this.elementMediators.push(mediator as ElementMediator<any, HTMLElement | Text, any>);
	}

	public addPropagatingElementMediator(mediator: any): void {
		this.propagatingElementMediators.push(mediator as ElementMediator<any, HTMLElement | Text, any>);
	}

	public addNamedElement(name: string, element: HTMLElement): void {
		this.namedElements[name] = element;
	}

	public isValidated(): boolean {
		return this.validated;
	}


}

class TextElementMediator extends AbstractElementMediator<string, Text, any> {

	constructor(dependencies: any) {
		super(dependencies, false, asString);
	}

	public populate(): void {
		this.getEl().textContent = this.getModelMediator().get();
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().textContent = current;
	}

	protected validate(element: Text, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

class UtilityComponentFactoryImpl implements ComponentFactory {

	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => any;

	private module: Module;

	private valueFn: () => any;

	constructor(module: Module, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any, valueFn: () => any) {
		this.module = module;
		this.template = template;
		this.prefix = prefix;
		this.parent = parent;
		this.parentId = parentId;
		this.parentModelFn = parentModelFn;
		this.valueFn = valueFn;
	}

	public create(): Nestable {
		return new Component(this.template, {
			prefix: this.prefix,
			parentModelFn: this.parentModelFn,
			module: this.module,
			repeatable: true,
			itemFn: this.valueFn,
			parent: this.parent,
			skipId: this.parentId
		} as ComponentOptions);
	}

}

class ItemComponentFactoryImpl implements ComponentFactory {

	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => any;

	private module: Module;

	constructor(module: Module, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => any, valueFn: () => any) {
		this.module = module;
		this.template = template;
		this.prefix = prefix;
		this.parent = parent;
		this.parentId = parentId;
		this.parentModelFn = parentModelFn;
	}

	public create(item?: any): Nestable {
		return new Component(this.template, {
			prefix: this.prefix,
			parentModelFn: this.parentModelFn,
			module: this.module,
			repeatable: true,
			itemFn: () => item,
			parent: this.parent,
			skipId: this.parentId
		} as ComponentOptions);
	}

}

class EmbeddedComponentFactoryImpl implements ComponentFactory {

	private module: Module;

	private componentId: string;

	private moduleId: string;

	private parent: Nestable;

	private parentId: string;

	constructor(module: Module, componentId: string, moduleId: string, parent: Nestable, parentId: string) {
		this.module = module;
		this.componentId = componentId;
		this.moduleId = moduleId;
		this.parent = parent;
		this.parentId = parentId;
	}

	public create(item: any): Nestable {
		const module: Module = isDefined(this.moduleId) && this.moduleId.trim().length > 0
			? this.module.getModule(this.moduleId)
			: this.module.getDefaultModule();

		const component: Nestable = module.get(this.componentId);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setItemFn", () => item);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "skipId", this.parentId);
		component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent);

		return component;
	}

}

class ExpressionIdStrategyImpl implements IdStrategy {

	private logger: Logger;

	private code: string;

	private expression: string;

	private fn: Function;

	constructor(expression: string) {
		this.logger = LoggerFactory.getLogger("Id Function: " + expression);
		this.expression = expression;
		this.code = '"use strict"; return function(i,item,v,value) { return ' + expression + ' }(arguments[0], arguments[0], arguments[0], arguments[0]);';
		this.fn = Function(this.code);
	}

	public check(item: any): boolean {
		return false;
	}

	public enrich(item: any, index: number): void {
		// Intentionally do nothing
	}

	public extract(item: any): string {
		let id: string = null;

		try {
			const itemFn: () => any = () => item;
			id = this.fn.apply({}, [itemFn]);
		} catch (e) {
			this.logger.error(`\nAn exception (${ e['name'] }) was thrown invoking the id function expression: ${ this.expression }\n\nIn context:\n${ this.code }\n\nException message: ${ e['message'] }\n\n`, e);

			throw e;
		}

		return id;
	}

	public init(): void {
		// Intentionally do nothing
	}

}

class GeneratedIdStrategyImpl implements IdStrategy {

	private idKey: string;

	constructor(idKey: string) {
		this.idKey = idKey;
	}

	public check(item: any): boolean {
		return isDefined(item[this.idKey]);
	}

	public enrich(item: any, index: number): void {
		item[this.idKey] = uuidV4();
	}

	public extract(item: any): string {
		return item[this.idKey] + "";
	}

	public init(): void {
		// Intentionally do nothing
	}

}

class InvalidIdStrategyImpl implements IdStrategy {

	public check(item: any): boolean {
		return true;
	}

	public enrich(item: any, index: number): void {
		// Intentionally do nothing
	}

	public extract(item: any): string {
		return null;
	}

	public init(): void {
		throw new Error("Invalid strategy for \"each\".  Must be \"generated\", \"none\", or \"expression\".");
	}

}

class NoneIdStrategyImpl implements IdStrategy {

	private idKey: string;

	constructor(idKey: string) {
		this.idKey = idKey;
	}

	public check(item: any): boolean {
		return isDefined(item[this.idKey]);
	}

	public enrich(item: any, index: number): void {
		throw new Error(`Missing id in field ${ this.idKey } for item at index ${ index }.  All repeat items must include a string convertable id to be repeated.`);
	}

	public extract(item: any): string {
		return item[this.idKey] + "";
	}

	public init(): void {
		// Intentionally do nothing
	}

}

const DEFAULT_ID_KEY: string = "id";

interface Params {

	idkey: string;

	expression: string;

	mode: string;

}

/**
 *
 */
class ValuedModel extends AbstractElementMediator<string, HTMLInputElement, any> {

	public wire(): void {
		this.bridge("input");
		this.on("input").forChannel("dom").invoke(this.handleInput);
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().value);
		}, []);
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().value = current;
	}

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

class Style extends AbstractElementMediator<any, HTMLElement, any> {

	public populate(): void {
		this.onTargetChange(null, this.getModelMediator().get());
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		if (current === null) {
			return;
		}

		for (const key in current) {
			if (!current.hasOwnProperty(key)) {
				continue;
			}

			this.getEl().style[key] = current[key] + "";
		}
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

class ReadOnly extends AbstractElementMediator<boolean, HTMLInputElement, any> {

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public populate(): void {
		this.onTargetChange(null, this.getModelMediator().get());
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().readOnly = current;
	}

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

/**
 *
 */
class MultiSelectValueModel extends AbstractElementMediator<string | string[], HTMLSelectElement, any> {

	public wire(): void {
		this.bridge("input");
		this.on("input").forChannel("dom").invoke(this.handleInput);
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public populate(): void {
		this.onTargetChange(null, this.getModelMediator().get());
	}

	public handleInput(event: Event): void {
		if (this.getEl().multiple) {
			const selectedValues: (string | number)[] = [];

			for (let i = 0; i < this.getEl().selectedOptions.length; i++) {
				const optValue: string = this.getEl().selectedOptions.item(i).getAttribute("value");
				selectedValues.push(optValue);
			}

			this.$apply(() => {
				this.getModelMediator().set(selectedValues);
			}, []);
		} else {
			this.$apply(() => {
				this.getModelMediator().set(this.getEl()["value"]);
			}, []);
		}
	}

	protected onTargetChange(previous: string | string[], current: string | string[]): void {
		if (this.getEl().multiple) {
			current = (current === null) ? [] : current;

			for (let i = 0; i < this.getEl().options.length; i++) {
				const element: HTMLOptionElement = this.getEl().options.item(i);
				element.selected = (current.indexOf(element.value) !== -1);
			}
		} else {
			this.getEl().value = current as string;
		}
	}

	protected validate(element: HTMLSelectElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

/**
 *
 */
class InputValueModel extends AbstractElementMediator<string, HTMLInputElement, any> {

	public wire(): void {
		this.bridge("input");
		const isRadio: boolean = this.getEl().type.toLowerCase() === "radio";
		this.on("input").forChannel("dom").invoke(isRadio ? this.handleRadioInput : this.handleInput);
		this.getModelMediator().watch(this, (isRadio ? this.onRadioTargetChange : this.onTargetChange));
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().value);
		}, []);
	}

	public handleRadioInput(event: Event): void {
		if (this.getEl().checked) {
			this.$apply(() => {
				this.getModelMediator().set(this.getEl().value);
			}, []);
		}
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().value = current;
	}

	protected onRadioTargetChange(previous: string, current: string): void {
		if (this.getEl().value === current) {
			this.getEl().checked = true;
		}
	}

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

/**
 *
 */
class If extends AbstractElementMediator<boolean, HTMLElement, any> {

	private reference: ElementReference<HTMLElement>;

	constructor(deps: any) {
		super(deps, false, asBoolean, false);
	}

	public wire(): void {
		this.reference = new ElementReferenceImpl<HTMLElement>(this.getEl(), "Hidden");

		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

/**
 *
 */
class Hidden extends AbstractElementMediator<boolean, HTMLElement, any> {

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().hidden = current;
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

class ForceFocus extends AbstractElementMediator<boolean, HTMLElement, any> {

	private shouldFocus: boolean;

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		this.bridge("focusout");
		this.on("focusout").forChannel("dom").invoke(this.handleFocus);
		this.on(Events.COMPONENT_NESTING_CHANGED).forChannel(INTERNAL_CHANNEL_NAME).invoke(this.handleFocus);
		this.shouldFocus = this.getModelMediator().get();

		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}

		this.handleFocus();
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleFocus(): void {
		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.shouldFocus = current;
		this.handleFocus();
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

class Enabled extends AbstractElementMediator<boolean, HTMLInputElement, any> {

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().disabled = !current;
	}

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

class CSSClass extends AbstractElementMediator<any, HTMLElement, any> {

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	private onTargetChange(previous: any, current: any): void {
		const oldClasses: string[] = (this.getEl().className || "").trim().split(" ");
		const newClasses: string[] = [];
		const map: any = current || {};

		for (const value of oldClasses) {
			if (!map.hasOwnProperty(value)) {
				newClasses.push(value);
			}
		}

		for (const key in map) {
			if (map.hasOwnProperty(key) && !!map[key]) {
				newClasses.push(key);
			}
		}

		this.getEl().className = newClasses.join(" ");
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

/**
 *
 */
class Checked extends AbstractElementMediator<boolean, HTMLInputElement, any> {

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		this.bridge("input");
		this.getModelMediator().watch(this, this.onTargetChange);
		this.on("input").forChannel("dom").invoke(this.handleInput);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().set(this.getEl().checked);
		}, []);
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().checked = current;
	}

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

/**
 *
 */
class Each extends AbstractElementMediator<any[], HTMLElement, Params> {

	private map: SimpleMap<Nestable>;

	private empty: Nestable;

	private first: Nestable;

	private last: Nestable;

	private ids: string[];

	private localScope: ScopeImpl;

	private scopeItem: any;

	private itemFactory: ComponentFactory;

	private idStrategy: IdStrategy;

	private elIsSelect: boolean;

	private alternatives: {
		test: Evaluator;
		factory: ComponentFactory;
	}[];

	private populationComplete: boolean;

	constructor(deps: any) {
		super(deps, true, asIdentity);
		this.idStrategy = null;
		this.elIsSelect = (this.getEl().tagName.toLowerCase() === "select");
		this.populationComplete = false;
		this.disableChildConsumption();

		if (!(this.getEl().querySelector(`template[${ this.getPrefix() }type=item]`))) {
			const errMsg: string = `${ this.getEl().tagName.toLowerCase() } element with a ${ this.getPrefix() }each attribute must have at least one child <template ${ this.getPrefix() }type='item'> node/element.`;
			throw new TemplateError(errMsg);
		}
	}

	public wire(): void {
		/*
		let workContinue: boolean = false;
		Array.from(this.getEl().children).forEach((child: Element) => {
			if (!workContinue && child.nodeName.toLowerCase() === "template") {
				if (Array.from(child.attributes).find((a: Attr) => {
					return (
						a.name.toLowerCase() === `${ this.getPrefix() }type`.toLowerCase()
						&& a.value.toLowerCase() === "item"
					);
				})) {
					workContinue = true;
					return;
				}
			}
		});
		*/

		this.map = {};
		this.empty = null;
		this.ids = [];
		this.itemFactory = null;
		this.alternatives = [];
		this.localScope = new ScopeImpl(false);

		const modelFn: () => any = () => this.getModelFn();
		const itemFn: () => any = () => this.scopeItem;
		this.localScope.setParent(this.getParent().scope() as ScopeImpl);
		this.localScope.add("m", modelFn);
		this.localScope.add("v", itemFn);

		this.getModelMediator().watch(this, this.onTargetChange);
		const idKey: string = this.getParams().idkey || DEFAULT_ID_KEY;
		const idExpression: string = this.getParams().expression;
		const mode: string = this.getParams().mode || null;

		switch (mode) {
			case "generated":
				this.idStrategy = new GeneratedIdStrategyImpl(idKey);
				break;

			case "none":
				this.idStrategy = new NoneIdStrategyImpl(idKey);
				break;

			case "expression":
				this.idStrategy = new ExpressionIdStrategyImpl(idExpression);
				break;

			default:
				this.idStrategy = new InvalidIdStrategyImpl();
		}

		this.idStrategy.init();

		const children: HTMLCollection = this.getEl().children;

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if ("template" !== child.nodeName.toLowerCase()) {
				continue;
			}

			const template: HTMLTemplateElement = child as HTMLTemplateElement;
			const type: string = this.getExtractor().extract(template, "type");

			switch (type) {
				case "empty":
					this.empty = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case "first":
					this.first = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case "after":
					this.last = this.createFactory(template, UtilityComponentFactoryImpl).create();
					break;

				case "alt":
					const expression: string = this.getExtractor().extract(template, "test");
					this.alternatives.push({
						factory: this.createFactory(template, ItemComponentFactoryImpl),
						test: new Evaluator(expression, this.localScope)
					});

					break;

				case "item":
					this.itemFactory = this.createFactory(template, ItemComponentFactoryImpl);
					break;
			}
		}

		const el: HTMLElement = this.getEl();

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		if (this.empty) {
			el.appendChild(this.empty.getEl());
		}
	}

	public unwire(): void {
		if (this.empty) {
			this.empty.dispose();
		}

		if (this.first) {
			this.first.dispose();
		}

		if (this.last) {
			this.last.dispose();
		}

		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.dispose();
		}

		this.empty = null;
		this.map = {};
	}

	public requestMediatorSources(sources: MediatorSource[]): void {
		for (const key in this.map) {
			if (!this.map.hasOwnProperty(key)) {
				continue;
			}

			const component: Nestable = this.map[key];
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		if (this.first) {
			this.first.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		if (this.last) {
			this.last.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		if (this.empty) {
			this.empty.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}
	}

	protected onTargetChange(previous: any[], current: any[]): void {
		if (!this.isMutable() && this.populationComplete) {
			return;
		}

		const newIds: string[] = [];
		const items: any[] = current || [];

		// tslint:disable-next-line
		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			if (!this.idStrategy.check(item)) {
				this.idStrategy.enrich(item, i);
			}

			const id: string = this.idStrategy.extract(item);
			newIds.push(id);
		}

		if (!equals(10, this.ids, newIds)) {
			const newMap: SimpleMap<Nestable> = {};
			const components: Nestable[] = [];

			for (const item of items) {
				const id: string = this.idStrategy.extract(item);
				const component: Nestable = this.map[id] ? this.map[id] : this.create(item);
				newMap[id] = component;
				components.push(component);
				delete this.map[id];
			}

			for (const key in this.map) {
				if (this.map.hasOwnProperty(key)) {
					const component: Nestable = this.map[key];
					component.dispose();
					delete this.map[key];
				}
			}

			this.map = newMap;
			const el: HTMLElement = this.getEl();

			while (el.firstChild) {
				el.removeChild(el.lastChild);
			}

			if (components.length === 0) {
				if (this.empty) {
					el.appendChild(this.empty.getEl());
				}
			} else {
				const workingEl: HTMLElement | DocumentFragment
					= (this.elIsSelect) ? el : createDocumentFragmentOffDom();

				if (this.first) {
					workingEl.appendChild(this.first.getEl());
				}

				for (const component of components) {
					workingEl.appendChild(component.getEl());
				}

				if (this.last) {
					workingEl.appendChild(this.last.getEl());
				}
				if (!this.elIsSelect) {
					el.appendChild(workingEl);
				}
			}
		}

		this.ids = newIds;

		this.populationComplete = true;
	}

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		check(this.getMediatorPrefix() + ":mode", this.getParams().mode)
			.isDefined()
			.oneOf("none", "generated", "expression")
			.requireIfEquals("expression", this.getMediatorPrefix() + ":expression", this.getParams().expression);

		check(this.getMediatorPrefix() + ":idkey", this.getParams().idkey).notEmpty();
		check(this.getMediatorPrefix() + ":expression", this.getParams().expression).notEmpty();

		if (this.getEl().children.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let i = 0; i < this.getEl().children.length; i++) {
				const child: HTMLElement = this.getEl().children[i] as HTMLElement;

				if (child.tagName.toLowerCase() !== "template") {
					check(elementAsString(child)).reject("not allowed as a child element");
					continue;
				}

				const template: HTMLTemplateElement = child as HTMLTemplateElement;

				check(this.getExtractor().asTypePrefix("type") + " attribute on " + elementAsString(template), this.getExtractor().extract(template, "type"))
					.isDefined()
					.oneOf("empty", "first", "after", "alt", "item")
					.requireIfEquals("alt", this.getExtractor().asTypePrefix("test"), this.getExtractor().extract(template, "test"));

				check(this.getExtractor().asTypePrefix("component") + " attribute on " + elementAsString(template), this.getExtractor().extract(template, "component"))
					.requireIfTrue(template.content.childElementCount === 0)
					.disallowIfTrue(template.content.childElementCount > 0, "if a template body is supplied")
					.matches(VALID_ID);

				check(this.getExtractor().asTypePrefix("module") + " attribute on " + elementAsString(template), this.getExtractor().extract(template, "module"))
					.disallowIfTrue(template.content.childElementCount > 0, "if a template body is supplied")
					.matches(VALID_ID);
			}
		}
	}

	private create(item: any): Nestable {
		let factory: ComponentFactory = this.itemFactory;
		this.scopeItem = item;

		try {
			if (this.alternatives.length > 0) {
				for (const alternative of this.alternatives) {
					if (alternative.test.test()) {
						factory = alternative.factory;
						break;
					}
				}
			}
		} finally {
			this.scopeItem = null;
		}

		return factory.create(item);
	}

	private createFactory(template: HTMLTemplateElement, factory: any): ComponentFactory {
		const componentId: string = this.getExtractor().extract(template, "component");
		const moduleId: string = this.getExtractor().extract(template, "module");
		const valueExpression: string = this.getExtractor().extract(template, "value");
		const hasComponentId: boolean = isDefined(componentId) && componentId.trim().length > 0;

		// TODO - Eliminate redundant validation, if possible

		if (template.content.childElementCount > 0 && hasComponentId) {
			throw new AmbiguousMarkupError(`Ambiguous component definition in template for 'each' on expression: ${ this.getExpression() } and markup: ${ template.innerHTML }`);
		}

		if (template.content.childElementCount > 1) {
			throw new AmbiguousMarkupError(`Template definitions must only have one top-level tag in repeat on expression: ${ this.getExpression() } and markup: ${ template.innerHTML }`);
		}

		const valueFn: () => any = isDefined(valueExpression)
			? () => this.mediate(valueExpression).get()
			: this.getValueFn();

		return (hasComponentId)
			? new EmbeddedComponentFactoryImpl(this.getModule(), componentId, moduleId, this.getParent(), this.getParentId())
			: new factory(
				this.getModule(),
				template.innerHTML.trim(),
				this.getParent().getPrefix(),
				this.getParent(),
				this.getParentId(),
				this.getModelFn(),
				valueFn
			);
	}

}

class ElementReferenceImpl<E extends HTMLElement> implements ElementReference<E> {

	private placeholder: Comment;

	private element: E;

	constructor(root: HTMLElement, text: string) {
		requireNotNull(text, "placeholderText");
		this.placeholder = createCommentOffDom(text);
		this.element = null;
		root.parentElement.replaceChild(this.placeholder, root);
	}

	public set(element: E): void {
		const current: HTMLElement | Text = isDefined(this.element) ? this.element : this.placeholder as (HTMLElement | Text);
		const newElement: HTMLElement = isDefined(element) ? element : null;
		const parentElement: HTMLElement = current.parentElement;
		const replacement: HTMLElement | Text = isDefined(newElement) ? element : this.placeholder as (HTMLElement | Text);

		parentElement.replaceChild(replacement, current);

		this.element = newElement as E;
	}

	public get(): E {
		return this.element;
	}

}

class FilterBuilderImpl implements FilterBuilder {

	private watchable: Watchable;

	private watcher: Watcher<any[]>;

	private phase: Phase;

	constructor(watchable: Watchable, watcher: Watcher<any[]>) {
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher");
		this.phase = new IdentityPhaseImpl();
	}

	public withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new PredicatePhaseImpl(this.phase, expression, this.watchable, parameterExpressions);

		return this;
	}

	public withSimplePredicate(predicate: (index: number, value: any) => boolean): FilterBuilder {
		this.phase = new SimplePredicatePhaseImpl(this.phase, predicate);

		return this;
	}

	public withPhase(fn: (input: any[]) => any[]): FilterBuilder {
		this.phase = new DelegatingPhaseImpl(this.phase, fn);

		return this;
	}

	public withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new SortPhaseImpl(this.phase, expression, this.watchable, parameterExpressions);

		return this;
	}

	public with(fn: (builder: FilterBuilder) => void): FilterBuilder {
		fn.apply(fn, [this]);

		return this;
	}

	public withLimit(limit: number): FilterBuilder {
		return this.withSimplePredicate((index: number, value: any) => index < limit);
	}

	public build(): Filter {
		return new FilterImpl(this.watchable, this.watcher, this.phase);
	}

	public paged(): PagedFilter {
		return new PagedFilterImpl(this.build());
	}

	public limited(): LimitOffsetFilter {
		return new LimitOffsetFilterImpl(this.build());
	}
}

class FilterImpl implements Filter, Watcher<any[]> {

	private filteredItems: any[];

	private watchable: Watchable;

	private watcher: Supplier<any[]>;

	private phase: Phase;

	private callbacks: Callback[];

	private logger: Logger;

	constructor(watchable: Watchable, watcher: Watcher<any[]>, phase: Phase) {
		this.logger = LoggerFactory.getLogger("FilterImpl");
		this.filteredItems = [];
		this.phase = phase;
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher").addCallback(this, () => this.refresh());
		this.callbacks = [];
		this.phase.setCallback(() => this.refresh());
	}

	public items(): any[] {
		return this.filteredItems;
	}

	public extend(): FilterBuilder {
		return new FilterBuilderImpl(this.watchable, this);
	}

	public get(): any[] {
		return this.items();
	}

	public addCallback(context: any, callback: () => void): Watcher<any[]> {
		requireNotNull(context, "context");
		requireNotNull(callback, "callback");

		this.callbacks.push({
			context: context,
			fn: callback
		});

		return this;
	}

	public invalidate(): void {
		this.logger.trace("Invalidated");
		this.phase.invalidate();
	}

	private filter(items: any[]): any[] {
		const source: any[] = [];

		this.logger.ifTrace(() => ({
			message: "Before filtering",
			items: items
		}));

		// tslint:disable-next-line:prefer-for-of
		for (let i: number = 0; i < items.length; i++) {
			source.push(items[i]);
		}

		this.logger.trace("Invalidated");

		const result: any[] = this.phase.process(source);

		this.logger.ifTrace(() => ({
			message: "After filtering",
			items: result
		}));

		return result;
	}

	public refresh(): void {
		const result: any[] = this.filter(this.watcher.get());

		if (isDefined(result)) {
			this.filteredItems = result;

			for (const callback of this.callbacks) {
				callback.fn.apply(callback.fn, []);
			}
		}
	}

}

class LimitOffsetFilterImpl implements LimitOffsetFilter {

	private parent: FilterImpl;

	private limiting: FilterImpl;

	private limit: number;

	private offset: number;

	private logger: Logger;

	constructor(parent: Filter) {
		this.logger = LoggerFactory.getLogger("LimitOffsetFilterImpl");
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.limiting = this.parent.extend()
			.withPhase((input: any[]) => {
				let result: any[] = input.slice(this.offset);

				if (isDefined(this.limit)) {
					result = result.slice(0, this.limit);
				}

				return result;
			})
			.build() as FilterImpl;
		this.offset = 0;
		this.limit = null;
	}

	public getLimit(): number {
		return this.limit;
	}

	public setLimit(limit: number): void {
		this.logger.ifTrace(() => "Limit set to: " + limit);
		this.limit = isDefined(limit) ? Math.floor(limit) : null;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public getOffset(): number {
		return this.offset;
	}

	public setOffset(offset: number): void {
		this.logger.ifTrace(() => "Offset set to: " + offset);
		this.offset = isDefined(offset) ? Math.floor(offset) : 0;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public setLimitAndOffset(limit: number, offset: number): void {
		this.logger.ifTrace(() => "Limit set to: " + limit);
		this.logger.ifTrace(() => "Offset set to: " + offset);
		const oldLimit: number = this.limit;
		const oldOffset: number = this.offset;

		this.limit = limit;
		this.offset = isDefined(offset) ? offset : 0;

		if (!equals(DEFAULT_EQUALS_DEPTH, oldLimit, this.limit) || !equals(DEFAULT_EQUALS_DEPTH, oldOffset, this.offset)) {
			this.limiting.invalidate();
			this.limiting.refresh();
		}
	}

	public items(): any[] {
		return this.limiting.items();
	}

	public extend(): FilterBuilder {
		return this.limiting.extend();
	}

	public addCallback(context: any, callback: () => void): void {
		this.limiting.addCallback(context, callback);
	}

}

class PagedFilterImpl implements PagedFilter {

	private parent: FilterImpl;

	private limited: LimitOffsetFilterImpl;

	private page: number;

	private pageSize: number;

	private atBeginning: boolean;

	private atEnd: boolean;

	private moreBefore: boolean;

	private moreAfter: boolean;

	private logger: Logger;

	constructor(parent: Filter) {
		this.logger = LoggerFactory.getLogger("PagedFilterImpl");
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.limited = this.parent.extend().limited() as LimitOffsetFilterImpl;
		this.page = 0;
		this.pageSize = 10;
		this.parent.addCallback(this, () => {
			this.enforcePageBounds();
			this.sync();
		});
		this.sync();
	}

	public getPageSize(): number {
		return this.pageSize;
	}

	public setPageSize(size: number): void {
		this.logger.ifTrace(() => "Page size set to: " + size);
		this.pageSize = (size < 1) ? 1 : Math.floor(size);
		this.sync();
	}

	public getTotalPages(): number {
		return Math.ceil(this.parent.items().length / this.pageSize);
	}

	public getPage(): number {
		return this.page;
	}

	public setPage(page: number): void {
		this.logger.ifTrace(() => "Page set to: " + page);
		this.page = Math.floor(page);
		this.enforcePageBounds();

		this.sync();
	}

	public toPrevious(): void {
		this.setPage(this.page - 1);
	}

	public toNext(): void {
		this.setPage(this.page + 1);
	}

	public toStart(): void {
		this.setPage(0);
	}

	public toEnd(): void {
		this.setPage(this.getTotalPages());
	}

	public items(): any[] {
		return this.limited.items();
	}

	public extend(): FilterBuilder {
		return this.limited.extend();
	}

	public addCallback(context: any, callback: () => void): void {
		this.limited.addCallback(context, callback);
	}

	public enforcePageBounds(): void {
		if (this.page < 0) {
			this.page = 0;
		}

		if (this.page >= this.getTotalPages()) {
			this.page = this.getTotalPages() - 1;
		}

		if (this.page < 0) {
			this.page = 0;
		}

		this.logger.ifTrace(() => "Page normalized to: " + this.page);
	}

	public isAtBeginning(): boolean {
		return this.atBeginning;
	}

	public isAtEnd(): boolean {
		return this.atEnd;
	}

	public isMoreBefore(): boolean {
		return this.moreBefore;
	}

	public isMoreAfter(): boolean {
		return this.moreAfter;
	}

	private sync(): void {
		this.atBeginning = (this.page === 0);
		this.atEnd = (this.page >= this.getTotalPages() - 1);
		this.moreBefore = !this.atBeginning;
		this.moreAfter = !this.atEnd;
		this.limited.setLimitAndOffset(this.pageSize, this.page * this.pageSize);
	}

}

abstract class AbstractPhaseImpl implements Phase {

	private previous: Phase;

	private memo: any[];

	private callback: () => void;

	private logger: Logger;

	constructor(name: string, previous: Phase) {
		this.logger = LoggerFactory.getLogger(name);
		this.previous = requireNotNull(previous, "previous");
		this.memo = null;
		this.callback = NO_OP_FN;
	}

	public process(items: any[]): any[] {
		this.logger.ifTrace(() => ({
			message: "Received for processing",
			items: items
		}));

		const processed: any[] = this.previous.process(items);

		this.logger.ifTrace(() => ({
			message: "After processing",
			items: items
		}));

		if (!isDefined(processed) || equals(DEFAULT_EQUALS_DEPTH, processed, this.memo)) {
			this.logger.ifTrace(() => "Not changed, returning null");
			return null;
		}

		this.memo = clone(DEFAULT_CLONE_DEPTH, processed);

		return this.execute(processed);
	}

	public onChange(): void {
		this.logger.trace("Changed - Invoking callbacks");
		this.memo = null;
		this.callback();
	}

	public invalidate(): void {
		this.onChange();
		this.logger.trace("Changed - Invalidating previous");
		this.previous.invalidate();
	}

	public setCallback(callback: () => void): void {
		this.callback = callback;
		this.previous.setCallback(callback);
	}

	protected getLogger(): Logger {
		return this.logger;
	}

	protected abstract execute(items: any[]): any[];

}

class DelegatingPhaseImpl extends AbstractPhaseImpl {

	private fn: (input: any[]) => any[];

	constructor(previous: Phase, fn: (input: any[]) => any[]) {
		super("Delegating Phase", previous);
		this.fn = requireNotNull(fn, "fn");
	}

	protected execute(items: any[]): any[] {
		return this.fn.apply({}, [items]);
	}

}

class IdentityPhaseImpl implements Phase {

	public process(items: any[]): any[] {
		return items;
	}

	public setCallback(callback: () => void): void {
		// Intentionally do nothing
	}

	public invalidate(): void {
		// Intentionally do nothing
	}

}

class PredicatePhaseImpl extends AbstractPhaseImpl {

	private evaluator: IndexedEvaluator<boolean>;

	private valueFunctions: (() => any)[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super("PredicatePhaseImpl - " + expression, previous);
		requireNotNull(expression, "expression");
		this.evaluator = new IndexedEvaluator(expression, watchable.getWatchContext() as ScopeImpl, asBoolean);
		this.valueFunctions = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Supplier<any> = new WatcherImpl<any>(watchable, parameterExpression).addCallback(this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: any[]): any[] {
		const result: any[] = [];

		this.getLogger().ifTrace(() => ({
			message: "Before predicate filtration",
			items: items
		}));

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (this.evaluator.test(current, i, this.valueFunctions)) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => ({
			message: "After predicate filtration",
			items: result
		}));

		return result;
	}

}

class SimplePredicatePhaseImpl extends AbstractPhaseImpl {

	private predicate: (index: number, value: any) => boolean;

	constructor(previous: Phase, predicate: (index: number, value: any) => boolean) {
		super("SimplePredicatePhaseImpl", previous);
		this.predicate = requireNotNull(predicate, "predicate");
	}

	protected execute(items: any[]): any[] {
		const result: any[] = [];

		this.getLogger().ifTrace(() => ({
			message: "Before predicate filtration",
			items: items
		}));

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (this.predicate.apply({}, [i, current])) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => ({
			message: "After predicate filtration",
			items: result
		}));

		return result;
	}

}

class SortPhaseImpl extends AbstractPhaseImpl {

	private evaluator: ComparisonEvaluator;

	private valueFunctions: (() => any)[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super("SortPhaseImpl - " + expression, previous);
		requireNotNull(expression, "expression");
		this.evaluator = new ComparisonEvaluator(expression, watchable.getWatchContext() as ScopeImpl);
		this.valueFunctions = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Supplier<any> = new WatcherImpl<any>(watchable, parameterExpression).addCallback(this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: any[]): any[] {
		this.getLogger().ifTrace(() => ({
			message: "Before sort",
			items: items
		}));

		items.sort((first: any, second: any) => this.evaluator.compare(first, second, this.valueFunctions));

		this.getLogger().ifTrace(() => ({
			message: "After sort",
			items: items
		}));

		return items;
	}

}

class WatcherImpl<T> implements Watcher<T> {

	private value: any;

	private callbacks: Callback[];

	private logger: Logger;

	constructor(watchable: Watchable, expression: string) {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		this.logger = LoggerFactory.getLogger("WatcherImpl - " + expression);
		this.callbacks = [];
		this.value = watchable.evaluate(expression);
		watchable.watch(expression, this.onChange, asIdentity, this);
	}

	public onChange(previous: any, current: any): void {
		this.logger.ifTrace(() => ({
			message: "Changed",
			previous: previous,
			current: current
		}));

		this.value = current;

		for (const callback of this.callbacks) {
			callback.fn.apply(callback.context, []);
		}
	}

	public addCallback(context: any, callback: () => void): Watcher<T> {
		requireNotNull(context, "context");
		requireNotNull(callback, "callback");

		this.callbacks.push({
			context: context,
			fn: callback
		});

		return this;
	}

	public get(): T {
		return this.value as T;
	}

}

class Filters {

	public static builder(watchable: Watchable, expression: string): FilterBuilder {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		const watcher: Watcher<any[]> = new WatcherImpl<any[]>(watchable, expression);
		return new FilterBuilderImpl(watchable, watcher);
	}

}

const builder = function(rootSelector: string): StageBuilder {
	return new StageBuilderImpl(rootSelector);
};

function create(selector: string, initialValues?: any): void {
	domReady(() => {
		const elements: NodeListOf<HTMLElement> = window.document.querySelectorAll(selector);
		const eLength = ((elements) ? elements.length : 0);
		if (eLength !== 1) {
			throw new SelectorError(`CSS selector MUST identify single HTMLElement: '${ selector }' - ${ eLength } found`);
		}

		const moduleContext: ModulesContext = new ModulesContextImpl();
		const element: HTMLElement = elements[0];
		const renderer: Renderer = new IdentityRendererImpl(element);
		const root: Component = new Component(renderer, { module: moduleContext.getDefaultModule(), alwaysConnected: true } as ComponentOptions);

		if (isDefined(initialValues)) {
			for (const key in initialValues) {
				if (!initialValues.hasOwnProperty(key) || startsWith(key, "$")) {
					continue;
				}

				root[key] = initialValues[key];
			}
		}
		root.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
		root.message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", null);
		window["rootCydranInstance"] = root;
	});
}

class CydranConfig {

	constructor() { /**/ }

	public useTrace(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.TRACE);
	}

	public useDebug(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.DEBUG);
	}

	public useInfo(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.INFO);
	}

	public useWarn(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.WARN);
	}

	public useError(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.ERROR);
	}

	public useFatal(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.FATAL);
	}

	public useDisabled(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.DISABLED);
	}
}

class StageBuilderImpl implements StageBuilder {

	private config: CydranConfig;

	private instance: StageImpl;

	constructor(rootSelector: string) {
		this.config = new CydranConfig();
		this.instance = new StageImpl(rootSelector);
	}

	public withComponentBefore(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentBefore(id, moduleName);
		return this;
	}

	public withComponentAfter(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentAfter(id, moduleName);
		return this;
	}

	public withComponent(id: string, moduleName?: string): StageBuilder {
		return this.withComponentAfter(id, moduleName);
	}

	public withInitializer(callback: (stage?: Stage) => void): StageBuilder {
		this.instance.withInitializer(callback);
		return this;
	}

	public withTraceLogging(): StageBuilder {
		this.config.useTrace();
		return this;
	}

	public withDebugLogging(): StageBuilder {
		this.config.useDebug();
		return this;
	}

	public withInfoLogging(): StageBuilder {
		this.config.useInfo();
		return this;
	}

	public withWarnLogging(): StageBuilder {
		this.config.useWarn();
		return this;
	}

	public withErrorLogging(): StageBuilder {
		this.config.useError();
		return this;
	}

	public withFatalLogging(): StageBuilder {
		this.config.useFatal();
		return this;
	}

	public withLoggingDisabled(): StageBuilder {
		this.config.useDisabled();
		return this;
	}

	public getModule(name: string): Module {
		return this.instance.getModules().getModule(name);
	}

	public getDefaultModule(): Module {
		return this.instance.getModules().getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): StageBuilder {
		this.instance.getModules().forEach(fn);
		return this;
	}

	public withElementMediator(name: string, supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): StageBuilder {
		this.instance.getModules().registerElementMediator(name, supportedTags, elementMediatorClass);
		return this;
	}

	public withConstant(id: string, instance: any): StageBuilder {
		this.instance.getModules().registerConstant(id, instance);
		return this;
	}

	public withPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public withPrototypeFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerPrototypeWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public withSingletonFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder {
		this.instance.getModules().registerSingletonWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withImplicit(id: string, template: string, options?: ComponentOptions): StageBuilder {
		this.withPrototypeFromFactory(id, () => new Component(template, merge([options, { module: this.getDefaultModule() }])));
		return this;
	}

	public withCapability(capability: (builder: StageBuilder) => void): StageBuilder {
		requireNotNull(capability, "capability")(this);
		return this;
	}

	public withScopeItem(name: string, item: any): StageBuilder {
		this.instance.getModules().getScope().add(name, item);
		return this;
	}

	public withProperties(properties: any): StageBuilder {
		this.instance.getProperties().load(properties);

		return this;
	}

	public build(): Stage {
		return this.instance;
	}

}

class StageImpl implements Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: ((stage?: Stage) => void)[];

	private root: Component;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private modules: ModulesContextImpl;

	constructor(rootSelector: string) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.logger = LoggerFactory.getLogger("Stage");
		this.modules = new ModulesContextImpl();
		this.started = false;
		this.initializers = [];
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.root = null;
	}

	public withInitializer(callback: (stage?: Stage) => void): Stage {
		requireNotNull(callback, "callback");
		this.initializers.push(callback);
		return this;
	}

	public withComponentBefore(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_ID);

		this.topComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public withComponentAfter(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_ID);

		this.bottomComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public start(): Stage {
		this.logger.debug("Start Requested");

		if (this.started) {
			this.logger.debug("Aleady Started");
			return this;
		}

		this.logger.debug("Cydran Starting");
		this.modules.registerConstantUnguarded(Ids.STAGE, this);
		domReady(() => this.domReady());

		return this;
	}

	public setComponent(component: Nestable): Stage {
		this.root.setChild("body", component);
		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.root.setChildFromRegistry("body", componentName, defaultComponentName);
		return this;
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");
		return this.root.get(id);
	}

	public getModules(): ModulesContext {
		return this.modules;
	}

	public getModule(name: string): Module {
		return this.modules.getModule(name);
	}

	public getDefaultModule(): Module {
		return this.modules.getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): void {
		this.modules.forEach(fn);
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.modules.broadcast(channelName, messageName, payload);
	}

	public registerConstant(id: string, instance: any): void {
		this.modules.registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.modules.registerPrototype(id, classInstance, dependencies);
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.modules.registerSingleton(id, classInstance, dependencies);
	}

	public getScope(): Scope {
		return this.modules.getScope();
	}

	public dispose(): void {
		this.modules.dispose();
		this.modules = null;
	}

	public isStarted(): boolean {
		return this.started;
	}

	public getProperties(): MutableProperties {
		return this.getModules().getProperties();
	}

	private domReady(): void {
		this.logger.debug("DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root = new Component(renderer, { module: this.modules.getDefaultModule(), alwaysConnected: true } as ComponentOptions);
		this.root.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
		this.started = true;
		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this, [this]);
		}

		this.logger.debug("Startup Complete");
	}

}

class StageRendererImpl implements Renderer {

	private selector: string;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	constructor(selector: string, topComponentIds: ComponentIdPair[], bottomComponentIds: ComponentIdPair[]) {
		this.selector = selector;
		this.topComponentIds = topComponentIds;
		this.bottomComponentIds = bottomComponentIds;
	}

	public render(): HTMLElement {
		const elements: NodeListOf<HTMLElement> = window.document.querySelectorAll(this.selector);
		const eLength = ((elements) ? elements.length : 0);
		if (eLength !== 1) {
			throw new SelectorError(`CSS selector MUST identify single HTMLElement: '${ this.selector }' - ${ eLength } found`);
		}

		const element: HTMLElement = elements[0];

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		for (const pair of this.topComponentIds) {
			const componentDiv: HTMLElement = createElementOffDom("script");
			componentDiv.setAttribute("type", "cydran/region");
			componentDiv.setAttribute("c:component", pair.componentId);
			componentDiv.setAttribute("c:module", pair.moduleId);
			element.appendChild(componentDiv);
		}

		const regionDiv: HTMLElement = createElementOffDom("script");
		regionDiv.setAttribute("type", "cydran/region");
		regionDiv.setAttribute("c:name", "body");
		element.appendChild(regionDiv);

		for (const pair of this.bottomComponentIds) {
			const componentDiv: HTMLElement = createElementOffDom("script");
			componentDiv.setAttribute("type", "cydran/region");
			componentDiv.setAttribute("c:component", pair.componentId);
			componentDiv.setAttribute("c:module", pair.moduleId);
			element.appendChild(componentDiv);
		}

		return element;
	}

}

class TextVisitor implements ElementVisitor<Text, Mvvm> {

	public visit(element: Text, context: Mvvm, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const result: Node[] = this.splitChild(element, context);

		if (result.length > 1) {
			for (const newNode of result) {
				element.parentNode.insertBefore(newNode, element);
			}

			element.remove();
		}
	}

	private splitChild(node: Node, context: Mvvm): Node[] {
		const source: string = node.textContent || "";
		const sections: string[] = source.split(/(\{\{|\}\}|\[\[|\]\])/);

		if (sections.length < 2) {
			return [node];
		}

		let state: number = STATE_OUTSIDE;

		const collected: Node[] = [];

		for (const section of sections) {
			if (state === STATE_OUTSIDE && section === "{{") {
				state = STATE_INSIDE_CURLY;
			} else if (state === STATE_OUTSIDE && section === "[[") {
				state = STATE_INSIDE_SQUARE;
			} else if (state === STATE_INSIDE_CURLY && section === "}}") {
				state = STATE_OUTSIDE;
			} else if (state === STATE_INSIDE_SQUARE && section === "]]") {
				state = STATE_OUTSIDE;
			} else if (state === STATE_INSIDE_CURLY || state === STATE_INSIDE_SQUARE) {
				const mutable: boolean = (state === STATE_INSIDE_CURLY);
				const beginComment: Comment = createCommentOffDom("#");
				collected.push(beginComment);
				const textNode: Text = createTextNodeOffDom(section);
				textNode.textContent = "";
				this.addTextElementMediator(section, textNode, context, mutable);
				collected.push(textNode);
				const endComment: Comment = createCommentOffDom("#");
				collected.push(endComment);
			} else {
				const textNode: Text = createTextNodeOffDom(section);
				collected.push(textNode);
			}
		}

		return collected;
	}

	private addTextElementMediator(expression: string, el: Text, context: Mvvm, mutable: boolean): void {
		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			mediatorPrefix: "Text",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		const elementMediator: ElementMediator<string, Text, any> = new TextElementMediator(deps);
		elementMediator.init();
		context.addMediator(elementMediator);
	}

}

class OtherVisitor implements ElementVisitor<HTMLElement, Mvvm> {

	private logger: Logger;

	constructor() {
		this.logger = LoggerFactory.getLogger("OtherVisitor");
	}

	public visit(element: HTMLElement, context: Mvvm, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const regex = /^[A-Za-z]+$/;
		const elName: string = element.tagName.toLowerCase();
		const extractor: AttributeExtractor = context.getExtractor();
		const elementName: string = extractor.extract(element, Attrs.ID);

		if (isDefined(elementName)) {
			context.addNamedElement(elementName, element);
			extractor.remove(element, Attrs.ID);
		}

		const attributes: NamedNodeMap = element.attributes;
		const length: number = attributes.length;
		const names: string[] = [];

		for (let i = 0; i < length; i++) {
			names.push(attributes[i].name);
		}

		let shouldConsumeChildren: boolean = true;

		for (const name of names) {
			const expression: string = element.getAttribute(name);

			if (extractor.isEventAttribute(name)) {
				const eventName: string = extractor.extractEventName(name);

				if (!regex.test(eventName)) {
					throw new MalformedOnEventError(`Event expressor '${ eventName }' MUST correspond to a valid event in the target environment`);
				}

				this.addEventElementMediator(eventName.toLowerCase(), this.trimExpression(expression), element, context);
				element.removeAttribute(name);
			} else if (extractor.isMediatorAttribute(name)) {
				const elementMediatorType: string = extractor.extractMediatorName(name);
				const mutable: boolean = !(startsWith(expression, "[[") && endsWith(expression, "]]"));
				shouldConsumeChildren = this.addElementMediator(elName, elementMediatorType, this.trimExpression(expression), element, topLevel, context, mutable);
				element.removeAttribute(name);
			} else if (expression.length > 4 && expression.indexOf("{{") === 0 && expression.indexOf("}}", expression.length - 2) !== -1) {
				this.addAttributeElementMediator(name, this.trimExpression(expression), element, context, true);
			} else if (expression.length > 4 && expression.indexOf("[[") === 0 && expression.indexOf("]]", expression.length - 2) !== -1) {
				this.addAttributeElementMediator(name, this.trimExpression(expression), element, context, false);
			}
		}

		if (shouldConsumeChildren) {
			this.consumeChildren(element, consumer);
		}
	}

	private consumeChildren(element: HTMLElement, consumer: (element: HTMLElement | Text | Comment) => void): void {
		// tslint:disable-next-line
		for (let i = 0; i < element.childNodes.length; i++) {
			consumer(element.childNodes[i] as HTMLElement | Text | Comment);
		}
	}

	private trimExpression(input: string): string {
		let result: string = trim(input, "{{", "}}");

		if (result === input) {
			result = trim(input, "[[", "]]");
		}

		return result;
	}

	private addEventElementMediator(eventName: string, expression: string, el: HTMLElement, context: Mvvm): void {
		const prefix: string = context.getExtractor().getPrefix();

		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: true
		};

		const elementMediator: EventElementMediator = new EventElementMediator(deps);
		elementMediator.setEventKey(eventName);
		elementMediator.init();
		context.addMediator(elementMediator);
	}

	private addElementMediator(tag: string,
		elementMediatorType: string,
		expression: string,
		el: HTMLElement,
		topLevel: boolean,
		context: Mvvm,
		mutable: boolean): boolean {

		if (elementMediatorType.indexOf(":") !== -1) {
			return;
		}

		const tags: SimpleMap<Type<ElementMediator<any, HTMLElement, any>>> = Factories.get(elementMediatorType);
		const mediatorPrefix: string = context.getExtractor().asTypePrefix(elementMediatorType);
		const prefix: string = context.getExtractor().getPrefix();

		let elementMediator: ElementMediator<any, HTMLElement, any> = null;

		if (!isDefined(tags)) {
			throw new TemplateError(`Unsupported element mediator attribute: ${ context.getExtractor().asTypePrefix(elementMediatorType) } on tag ${ elementAsString(el) }`);
		}

		let elementMediatorClass: Type<ElementMediator<any, HTMLElement, any>> = tags[tag];

		if (!isDefined(elementMediatorClass)) {
			elementMediatorClass = tags["*"];
		}

		if (!isDefined(elementMediatorClass)) {
			throw new TemplateError(`Unsupported tag: ${ tag } for element mediator ${ context.getExtractor().asTypePrefix(elementMediatorType) } on tag ${ elementAsString(el) }`);
		}

		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: mediatorPrefix,
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		elementMediator = new elementMediatorClass(deps);

		if (topLevel && !elementMediator.isTopLevelSupported()) {
			this.logger.error(`Element mediator ${ elementMediatorType } not supported on top level component tags.`);
			return;
		}

		elementMediator.init();
		context.addMediator(elementMediator);

		if (elementMediator.hasPropagation()) {
			context.addPropagatingElementMediator(elementMediator);
		}

		return elementMediator.isChildrenConsumable();
	}

	private addAttributeElementMediator(attributeName: string, expression: string, el: HTMLElement, context: Mvvm, mutable: boolean): void {
		const prefix: string = context.getExtractor().getPrefix();

		const deps: ElementMediatorDependencies = {
			mvvm: context,
			parent: context.getParent(),
			el: el,
			expression: expression,
			model: context.getModel(),
			prefix: prefix,
			mediatorPrefix: "Event",
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: mutable
		};

		const elementMediator: AttributeElementMediator = new AttributeElementMediator(deps);
		elementMediator.setAttributeName(attributeName);
		elementMediator.init();
		context.addMediator(elementMediator);
	}

}

class ScriptVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: Mvvm, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (!startsWith(element.type, CYDRAN_SCRIPT_PREFIX)) {
			return;
		}

		const type: string = removeFromBeginning(element.type, CYDRAN_SCRIPT_PREFIX);
		const visitor: ElementVisitor<HTMLScriptElement, any> = VISITORS[type];

		if (isDefined(visitor)) {
			visitor.visit(element, context, consumer, topLevel);
		}
	}

}

class MvvmDomWalkerImpl extends DomWalkerImpl<Mvvm> {

	constructor() {
		super();
		this.setTextVisitor(new TextVisitor());
		this.setDefaultVisitor(new OtherVisitor());
		this.addVisitor("script", new ScriptVisitor());
	}

}

const WALKER: DomWalker<Mvvm> = new MvvmDomWalkerImpl();

Factories.register("each", ["*"], Each);
Factories.register("checked", ["input"], Checked);
Factories.register("class", ["*"], CSSClass);
Factories.register("enabled", ["*"], Enabled);
Factories.register("force-focus", ["*"], ForceFocus);
Factories.register("hidden", ["*"], Hidden);
Factories.register("if", ["*"], If);
Factories.register("model", ["input"], InputValueModel);
Factories.register("model", ["select"], MultiSelectValueModel);
Factories.register("model", ["textarea"], ValuedModel);
Factories.register("readonly", ["*"], ReadOnly);
Factories.register("style", ["*"], Style);

export {
	HooksImpl, EventHooksImpl,
	Filters,
	ComponentInternalsImpl,
	Component,
	IdentityRendererImpl,
	NamedElementOperationsImpl,
	RegionImpl,
	StringRendererImpl,
	MvvmImpl,
	MvvmDomWalkerImpl,
	TextVisitor,
	TextElementMediator,
	ScriptVisitor,
	RegionVisitor,
	OtherVisitor,
	AttributeElementMediator,
	EventElementMediator,
	Factories,
	DigestionContextImpl,
	DigesterImpl,
	AttributeExtractorImpl,
	ModulesContextImpl,
	ModuleImpl,
	AbstractElementMediator,
	IdGenerator,
	PropertiesImpl,
	ElementReferenceImpl,
	DomWalkerImpl,
	Setter,
	ScopeImpl,
	ModelMediatorImpl,
	Invoker,
	IndexedEvaluator,
	Getter,
	Evaluator,
	ComparisonEvaluator,
	create,
	builder,
	StageBuilderImpl,
	StageImpl,
	StageRendererImpl,
	CydranConfig,
	asIdentity,
	asBoolean,
	asString,
	asNumber,
	ValidatorImpl,
	UndefinedValidatorsImpl,
	DefinedValidatorsImpl,
	CSSClass,
	Checked,
	Each,
	Enabled,
	ForceFocus,
	Hidden,
	If,
	InputValueModel,
	MultiSelectValueModel,
	ReadOnly,
	Style,
	ValuedModel
};
