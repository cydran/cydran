/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { test, expect, beforeEach, afterEach, jest, describe } from "@jest/globals";
import { assertNullGuarded, NullTester } from "test/TestUtils";
import { MutableProperties } from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";
import ScopeImpl from "scope/ScopeImpl";
import Scope from "scope/Scope";
import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import GlobalContextImpl from "context/GlobalContextImpl";
import { Context } from "context/Context";
import { RootContextImpl } from "context/AbstractNamedContextImpl";
import { defaulted } from "util/Utils";
import argumentsBuilder from "function/argumentsBuilder";
import { RegistrationError, UnsupportedOperationError } from "error/Errors";

class TestClass {

	private cnt: number = 0;

	public getCount(): number {
		return this.cnt;
	}

	public increment(): void {
		this.cnt++;
	}

}

class TestComponent extends Component {

	constructor(template: string, options: ComponentOptions) {
		super(template, defaulted(options, {}));
	}

}

const TEST: string = "test";
const FOO: string = "foo";
const INV_ID: string = "Invalid /id!";
const ID: string = "id";
const scope: ScopeImpl = new ScopeImpl();

function propertiesInstance(): MutableProperties {
	return new PropertiesImpl();
}

const tester: NullTester = new NullTester()
	.addFactory("scope", () => new ScopeImpl())
	.addFactory("properties", () => propertiesInstance)
	.addFactory(ID, () => ID)
	.addFactory("instance", () => FOO)
	.addFactory("classInstance", () => RootContextImpl)
	.addFactory("channelName", () => "channelName")
	.addFactory("messageName", () => "messageName")
	.addFactory("payload", () => FOO);

describe("RootContextImpl", () => {
	let testContext: Context = null;

	beforeEach(() => {
		testContext = new GlobalContextImpl().createChild();
	});

	afterEach(() => {
		testContext = null;
	});

	test("message() - nulls", () => {
		tester.testMethod(testContext, RootContextImpl.prototype.message, ["channelName", "messageName", null]);
	});

	test("message() - null payload", () => {
		expect(() => testContext.message(TEST, TEST, null)).not.toThrowError();
	});

	test("get() - null id", () => {
		assertNullGuarded("path", () => testContext.getObject(null));
	});

	test("get() - invalid id", () => {
		assertNullGuarded("path must be valid", () => testContext.getObject(INV_ID), "ValidationError");
	});

	test("message() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.message, ["channelName", "messageName", null]);
	});

	test("message() - null payload", () => {
		expect(() => testContext.message(TEST, TEST, null)).not.toThrowError();
	});

	test("registerConstant() - invalid id", () => {
		assertNullGuarded("id must be valid", () => testContext.registerConstant(INV_ID, "Foo"), "ValidationError");
	});

	test("registerConstant() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.registerConstant, [ID]);
	});

	test("registerSingleton() - invalid id", () => {
		assertNullGuarded(
			"id must be valid",
			() => testContext.registerSingleton(INV_ID, TestClass, argumentsBuilder().build()),
			"ValidationError"
		);
	});

	test("registerSingleton() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.registerSingleton, [ID, "classInstance"]);
	});

	test("registerPrototype() - invalid id", () => {
		assertNullGuarded(
			"id must be valid",
			() => testContext.registerPrototype(INV_ID, TestClass, argumentsBuilder().build()),
			"ValidationError"
		);
	});

	test("registerPrototype() - nulls", () => {
		tester.testMethod(testContext, GlobalContextImpl.prototype.registerPrototype, [ID, "classInstance"]);
	});

	test("getName(): string", () => {
		const name: string = testContext.getName();
		expect(name).not.toBeNull();
		expect(name).toEqual("Root");
	});

	test("hasRegistration", () => {
		const wkKey: string = "ctpn";
		const wkConst: string = "cydran.test.prop.name";
		testContext.registerConstant(wkKey, wkConst);
		const wkSpy = jest.spyOn(testContext, "hasRegistration");
		expect(testContext.hasRegistration("bubba")).toBe(false);
		expect(wkSpy).toBeCalledTimes(1);
		expect(testContext.hasRegistration(wkKey)).toBe(true);
	});

	test("$release", () => {
		const wkSpy = jest.spyOn(testContext, "$release");
		testContext.$release();
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("getProperties", () => {
		const wkSpy = jest.spyOn(testContext, "getProperties");
		const props: MutableProperties = testContext.getProperties();
		expect(props).not.toBeNull();
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("getScope", () => {
		const wkSpy = jest.spyOn(testContext, "getScope");
		const result: Scope = testContext.getScope();
		expect(result).not.toBeNull();
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("registerConstant and get", () => {
		const wkSpy = jest.spyOn(testContext, "registerConstant");
		const wkKey: string = "ctpn";
		const wkConst: string = "cydran.test.prop.name";
		testContext.registerConstant(wkKey, wkConst);
		expect(wkSpy).toBeCalledTimes(1);
		expect(testContext.getObject(wkKey)).toEqual(wkConst);
		expect(testContext.getObject("bubba")).toEqual(null);
	});

	test("registerPrototype - confirm prototypical", () => {
		const wkSpy = jest.spyOn(testContext, "registerPrototype");
		const wkKey: string = "ctpn";
		testContext.registerPrototype(wkKey, TestClass);
		expect(wkSpy).toBeCalledTimes(1);
		const res1: TestClass = testContext.getObject(wkKey);
		expect(res1).not.toBeNull();
		expect(res1.getCount()).toEqual(0);

		for (let x: number = 0; x < 5; x++) {
			res1.increment();
			expect(res1.getCount()).toEqual(x + 1);
		}

		const res2: TestClass = testContext.getObject(wkKey);
		expect(res2.getCount()).toEqual(0);
	});

	test("registerSingleton - confirm singleton", () => {
		const wkSpy = jest.spyOn(testContext, "registerSingleton");
		const wkKey: string = "ctpn";
		testContext.registerSingleton(wkKey, TestClass);
		expect(wkSpy).toBeCalledTimes(1);
		const res1: TestClass = testContext.getObject(wkKey);
		expect(res1).not.toBeNull();
		expect(res1.getCount()).toEqual(0);

		const sCnt: number = 5;
		for (let x: number = 0; x < sCnt; x++) {
			res1.increment();
			expect(res1.getCount()).toEqual(x + 1);
		}

		const res2: TestClass = testContext.getObject(wkKey);
		expect(res2.getCount()).toEqual(sCnt);
	});

	test("getName - Names set as expected", () => {
		const child: Context = testContext.addChild("first");
		const grandChild: Context = child.addChild("second");

		expect(testContext.getName()).toEqual("Root");
		expect(child.getName()).toEqual("first");
		expect(grandChild.getName()).toEqual("second");
	});

	test("getFullName - Full names are as expected", () => {
		const child: Context = testContext.addChild("first");
		const grandChild: Context = child.addChild("second");

		expect(testContext.getFullName()).toEqual("Root");
		expect(child.getFullName()).toEqual("first");
		expect(grandChild.getFullName()).toEqual("first.second");
	});
});

class Repository {

	private source: string;

	constructor(source: string) {
		this.source = source;
	}

	public getSource(): string {
		return this.source;
	}

}

class Facade {

	private repository: Repository;

	constructor(repository: Repository) {
		this.repository = repository;
	}

	public getRepository(): Repository {
		return this.repository;
	}

}

class ReplacementFacade {

	// Intentionally empty

}

class AwareFacade {

	private context: Context = null;

	public setContext(context: Context): void {
		this.context = context;
	}

	public getContext(): Context {
		return this.context;
	}

}

describe("ChildContextImpl.promote()", () => {
	let root: Context = null;
	let services: Context = null;

	beforeEach(() => {
		root = new GlobalContextImpl().createChild();
		services = root.addChild("services");
	});

	afterEach(() => {
		root = null;
		services = null;
	});

	test("same id - the parent resolves the child's object and promote returns the child", () => {
		services.registerSingleton("facade", Facade, argumentsBuilder().with("repository").build());
		services.registerConstant("repository", new Repository("child"));

		const result: Context = services.promote("facade");

		expect(result).toBe(services);
		expect(root.hasRegistration("facade")).toBe(true);
		expect(root.getObject<Facade>("facade")).toBeInstanceOf(Facade);
	});

	test("same id - visible from a sibling context", () => {
		services.registerSingleton("facade", Facade);
		services.promote("facade");
		const sibling: Context = root.addChild("sibling");

		expect(sibling.getObject("facade")).toBe(services.getObject("facade"));
	});

	test("override id - registered in the parent under the override id only", () => {
		services.registerSingleton("facade", Facade);

		services.promote("facade", "billing");

		expect(root.getObject("billing")).toBe(services.getObject("facade"));
		expect(root.hasRegistration("facade")).toBe(false);
		expect(services.hasRegistration("facade")).toBe(true);
	});

	test("null override id - promotes under the same id", () => {
		services.registerSingleton("facade", Facade);

		services.promote("facade", null);

		expect(root.getObject("facade")).toBe(services.getObject("facade"));
	});

	test("internal dependency stays hidden", () => {
		services.registerConstant("repository", new Repository("child"));
		services.registerPrototype("facade", Facade, argumentsBuilder().with("repository").build());

		services.promote("facade");

		const facade: Facade = root.getObject<Facade>("facade");
		expect(facade.getRepository().getSource()).toBe("child");
		expect(root.hasRegistration("repository")).toBe(false);
		expect(root.getObject("repository")).toBeNull();
	});

	test("one singleton shared by both contexts", () => {
		services.registerSingleton("facade", Facade);

		services.promote("facade");

		expect(root.getObject("facade")).toBe(services.getObject("facade"));
	});

	test("context-aware object gets the child context", () => {
		services.registerPrototype("facade", AwareFacade);

		services.promote("facade");

		expect(root.getObject<AwareFacade>("facade").getContext()).toBe(services);
	});

	test("the alias follows a re-registration in the child", () => {
		services.registerPrototype("facade", Facade);
		services.promote("facade");

		services.registerPrototype("facade", ReplacementFacade);

		expect(root.getObject("facade")).toBeInstanceOf(ReplacementFacade);
	});

	test("two levels up - an alias can be promoted again", () => {
		const inner: Context = services.addChild("inner");
		inner.registerSingleton("facade", Facade);

		inner.promote("facade");
		services.promote("facade");

		expect(root.getObject("facade")).toBe(inner.getObject("facade"));
	});

	test("unknown id - throws RegistrationError naming the id", () => {
		expect(() => services.promote("missing")).toThrow(RegistrationError);
		expect(() => services.promote("missing")).toThrow(
			"Unable to promote, context services has no registration of its own with id: missing"
		);
		expect(root.hasRegistration("missing")).toBe(false);
	});

	test("inherited id - throws RegistrationError and leaves the parent unchanged", () => {
		root.registerConstant("logger", "parent logger");

		expect(() => services.promote("logger")).toThrow(RegistrationError);
		expect(root.getObject("logger")).toBe("parent logger");
	});

	test("parent collision - throws RegistrationError naming the id and keeps the parent's object", () => {
		root.registerConstant("billing", "parent billing");
		services.registerSingleton("facade", Facade);

		expect(() => services.promote("facade", "billing")).toThrow(RegistrationError);
		expect(() => services.promote("facade", "billing")).toThrow("already registered with id: billing");
		expect(root.getObject("billing")).toBe("parent billing");
	});

	test("promoted twice - throws RegistrationError", () => {
		services.registerSingleton("facade", Facade);
		services.promote("facade");

		expect(() => services.promote("facade")).toThrow(RegistrationError);
	});

	test("null id", () => {
		assertNullGuarded("id", () => services.promote(null));
	});

	test("invalid id", () => {
		assertNullGuarded("id must be valid", () => services.promote(INV_ID), "ValidationError");
	});

	test("invalid override id - fails before anything is registered", () => {
		services.registerSingleton("facade", Facade);

		assertNullGuarded("overrideId must be valid", () => services.promote("facade", INV_ID), "ValidationError");
		expect(root.hasRegistration("facade")).toBe(false);
	});

	test("removeChild - removes the child's aliases from the parent", () => {
		services.registerSingleton("facade", Facade);
		services.registerSingleton("other", Facade);
		services.promote("facade");
		services.promote("other", "renamed");

		root.removeChild("services");

		expect(root.hasRegistration("facade")).toBe(false);
		expect(root.hasRegistration("renamed")).toBe(false);
		expect(root.getObject("facade")).toBeNull();
	});

	test("$release - removes the child's aliases from the parent", () => {
		services.registerSingleton("facade", Facade);
		services.promote("facade");

		services.$release();

		expect(root.hasRegistration("facade")).toBe(false);
	});

	test("removal keeps a registration the parent made under the id since", () => {
		services.registerSingleton("facade", Facade);
		services.promote("facade");
		root.registerConstant("facade", "parent facade");

		root.removeChild("services");

		expect(root.getObject("facade")).toBe("parent facade");
	});

	test("removal of a grandchild - removes what it promoted into the child", () => {
		const inner: Context = services.addChild("inner");
		inner.registerSingleton("facade", Facade);
		inner.promote("facade");

		services.removeChild("inner");

		expect(services.hasRegistration("facade")).toBe(false);
	});

	test("localResolution false - dependencies resolve from the child", () => {
		root.registerConstant("repository", new Repository("parent"));
		services.registerConstant("repository", new Repository("child"));
		services.registerPrototype("facade", Facade, argumentsBuilder().with("repository").build(), false);

		services.promote("facade");

		expect(root.getObject<Facade>("facade").getRepository().getSource()).toBe("child");
	});

	test("localResolution true - dependencies resolve from the caller", () => {
		root.registerConstant("repository", new Repository("parent"));
		services.registerConstant("repository", new Repository("child"));
		services.registerPrototype("facade", Facade, argumentsBuilder().with("repository").build(), true);

		services.promote("facade");

		expect(root.getObject<Facade>("facade").getRepository().getSource()).toBe("parent");
		expect(services.getObject<Facade>("facade").getRepository().getSource()).toBe("child");
	});
});

describe("RootContextImpl.promote()", () => {
	let global: GlobalContextImpl = null;
	let root: Context = null;

	beforeEach(() => {
		global = new GlobalContextImpl();
		root = global.createChild();
	});

	afterEach(() => {
		global = null;
		root = null;
	});

	test("throws UnsupportedOperationError and registers nothing", () => {
		root.registerSingleton("facade", Facade);

		expect(() => root.promote("facade")).toThrow(UnsupportedOperationError);
		expect(() => root.promote("facade")).toThrow("A root context has no parent to promote into");
		expect(global.hasRegistration("facade")).toBe(false);
	});

	test("null id", () => {
		assertNullGuarded("id", () => root.promote(null));
	});

	test("invalid id", () => {
		assertNullGuarded("id must be valid", () => root.promote(INV_ID), "ValidationError");
	});

	test("invalid override id", () => {
		assertNullGuarded("overrideId must be valid", () => root.promote("facade", INV_ID), "ValidationError");
	});
});
