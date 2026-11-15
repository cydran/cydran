/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Stage, Context, Component, create, argumentsBuilder, requireNotNull } from "@cydran/cydran";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";

class Repository {

	private name: string;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
	}

	public getName(): string {
		return this.name;
	}

}

class Formatter {

	public format(value: string): string {
		return "[" + value + "]";
	}

}

class BillingFacade {

	private repository: Repository;

	private formatter: Formatter;

	constructor(repository: Repository, formatter: Formatter) {
		this.repository = requireNotNull(repository, "repository");
		this.formatter = requireNotNull(formatter, "formatter");
	}

	public describe(): string {
		return this.formatter.format(this.repository.getName());
	}

}

class ReplacementFacade {

	public describe(): string {
		return "replacement";
	}

}

class Consumer extends Component {

	private facade: BillingFacade;

	constructor(facade: BillingFacade) {
		super('<div><p data-testid="consumer">{{m().getText()}}</p></div>');
		this.facade = requireNotNull(facade, "facade");
	}

	public getText(): string {
		return this.facade.describe();
	}

}

class PromotedWidget extends Component {

	constructor() {
		super("<div>widget</div>");
	}

}

function thrownName(activity: () => void): string {
	let name: string = null as unknown as string;

	try {
		activity();
	} catch (e) {
		name = (e as Error).name;
	}

	return name;
}

let stage: Stage = null as unknown as Stage;
let root: Context = null as unknown as Context;
let services: Context = null as unknown as Context;

describe("Registry Promotion", () => {
	beforeEach(() => {
		stage = create("body", {
			"cydran.startup.synchronous": true
		});
		stage.start();
		root = stage.getContext();
		services = root.addChild("services", (context: Context) => {
			context.registerConstant("repository", new Repository("internal billing"));
			context.registerSingleton("formatter", Formatter);
			context.registerSingleton("facade", BillingFacade, argumentsBuilder().with("repository").with("formatter").build());
		});
	});

	afterEach(() => {
		stage.$release();
		stage = null as unknown as Stage;
		root = null as unknown as Context;
		services = null as unknown as Context;
	});

	test("a component in the parent is injected with the promoted facade", () => {
		services.promote("facade");
		root.registerPrototype("consumer", Consumer, argumentsBuilder().with("facade").build());

		stage.setComponentByObjectId("consumer");

		expect(document.querySelector('[data-testid="consumer"]')?.textContent).toBe("[internal billing]");
	});

	test("the internals are not resolvable by id from the parent", () => {
		services.promote("facade");

		expect(root.getObject("facade")).toBeInstanceOf(BillingFacade);
		expect(root.hasRegistration("repository")).toBe(false);
		expect(root.hasRegistration("formatter")).toBe(false);
		expect(root.getObject("repository")).toBeNull();
		expect(root.getObject("formatter")).toBeNull();
	});

	test("a sibling context resolves the promoted facade", () => {
		services.promote("facade");
		const sibling: Context = root.addChild("sibling");

		expect(sibling.getObject("facade")).toBe(services.getObject("facade"));
	});

	test("an override id is resolvable in the parent instead of the original id", () => {
		services.promote("facade", "billing");

		expect(root.getObject<BillingFacade>("billing").describe()).toBe("[internal billing]");
		expect(root.getObject("facade")).toBeNull();
	});

	test("a promoted singleton is one instance in the parent and the child", () => {
		services.promote("facade");

		expect(root.getObject("facade")).toBe(services.getObject("facade"));
	});

	test("a promoted component gets the child context", () => {
		services.registerPrototype("widget", PromotedWidget);
		services.promote("widget");

		const widget: PromotedWidget = root.getObject<PromotedWidget>("widget");

		expect(widget.$c().getContext()).toBe(services);
	});

	test("the parent resolves the class the child registered most recently", () => {
		services.promote("facade");

		services.registerSingleton("facade", ReplacementFacade);

		expect(root.getObject<ReplacementFacade>("facade").describe()).toBe("replacement");
	});

	test("an alias promoted twice reaches the root from a grandchild", () => {
		const inner: Context = services.addChild("inner");
		inner.registerSingleton("deep", Formatter);

		inner.promote("deep");
		services.promote("deep");

		expect(root.getObject("deep")).toBe(inner.getObject("deep"));
	});

	test("removeChild removes the aliases from the parent", () => {
		services.promote("facade");
		services.promote("formatter", "sharedFormatter");

		root.removeChild("services");

		expect(root.hasRegistration("facade")).toBe(false);
		expect(root.hasRegistration("sharedFormatter")).toBe(false);
		expect(root.getObject("facade")).toBeNull();
	});

	test("promoting an unknown id fails with RegistrationError", () => {
		expect(thrownName(() => services.promote("missing"))).toBe("RegistrationError");
	});

	test("promoting an inherited id fails with RegistrationError", () => {
		root.registerConstant("logger", "root logger");

		expect(thrownName(() => services.promote("logger"))).toBe("RegistrationError");
		expect(root.getObject("logger")).toBe("root logger");
	});

	test("promoting onto an id the parent already has fails with RegistrationError", () => {
		root.registerConstant("billing", "root billing");

		expect(thrownName(() => services.promote("facade", "billing"))).toBe("RegistrationError");
		expect(root.getObject("billing")).toBe("root billing");
	});

	test("promoting from the stage's root context fails with UnsupportedOperationError", () => {
		root.registerConstant("rootThing", "value");

		expect(thrownName(() => root.promote("rootThing"))).toBe("UnsupportedOperationError");
	});

	test("promoting a null id fails with the null-value error", () => {
		expect(thrownName(() => services.promote(null as unknown as string))).toBe("NullValueError");
	});
});
