/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component, Context, argumentsBuilder, isDefined, requireNotNull } from "@cydran/cydran";
import TEMPLATE from "./ContextPromotionSpecimen.html";

const CHILD_NAME: string = "promotion";

class PromotionRepository {

	public getName(): string {
		return "internal billing";
	}

}

class PromotionFacade {

	private repository: PromotionRepository;

	constructor(repository: PromotionRepository) {
		this.repository = requireNotNull(repository, "repository");
	}

	public describe(): string {
		return "Facade over " + this.repository.getName();
	}

}

class PromotionCounter {

	private value: number = 0;

	public increment(): void {
		this.value++;
	}

	public getValue(): number {
		return this.value;
	}

}

/** Registered in the specimen's context: injected with the facade the child context promotes, when it resolves. */
class PromotionConsumer extends Component {

	private facade: PromotionFacade;

	constructor(facade: PromotionFacade) {
		super('<p data-testid="consumer-text">{{m().getText()}}</p>');
		this.facade = facade;
	}

	public getText(): string {
		return isDefined(this.facade) ? this.facade.describe() : "No facade";
	}

}

/** Registered in both contexts: shows the promoted singleton counter, when it resolves. */
class PromotionCounterView extends Component {

	private counter: PromotionCounter;

	constructor(counter: PromotionCounter) {
		super('<span data-testid="counter-value">{{m().getValue()}}</span>');
		this.counter = counter;
	}

	public getValue(): string {
		return isDefined(this.counter) ? String(this.counter.getValue()) : "No counter";
	}

}

class PromotionWidgetA extends Component {

	constructor() {
		super('<span data-testid="widget-text">Widget A</span>');
	}

}

class PromotionWidgetB extends Component {

	constructor() {
		super('<span data-testid="widget-text">Widget B</span>');
	}

}

/** Registered in the specimen's context: shown when the promoted widget no longer resolves. */
class PromotionFallback extends Component {

	constructor() {
		super('<span data-testid="widget-text">No widget</span>');
	}

}

function promotionCapability(context: Context): void {
	context.registerConstant("promotionRepository", new PromotionRepository());
	context.registerSingleton("promotionFacade", PromotionFacade, argumentsBuilder().with("promotionRepository").build());
	context.registerSingleton("promotionCounter", PromotionCounter);
	context.registerPrototype("promotionCounterView", PromotionCounterView, argumentsBuilder().with("promotionCounter").build());
	context.registerPrototype("promotionWidget", PromotionWidgetA);
	context.registerConstant("promotionLabel", "label from the child context");
	context.registerConstant("promotionTaken", "taken in the child context");
}

/**
 * Specimen: `Context.promote`. The specimen creates a child context under its own context, builds a facade from
 * internal registrations there, and promotes selected registrations into its own context. The regions and text show
 * what its own context resolves; the buttons re-register, remove the child, and trigger each promote failure.
 *
 * The child context is removed on unmount, so revisiting the specimen starts clean.
 */
class ContextPromotionSpecimen extends Component {

	private status: string;

	private internalRepository: string;

	private renamedLabel: string;

	private originalLabel: string;

	private facadeRegistered: string;

	private sameCounter: string;

	private results: { [key: string]: string };

	constructor() {
		super(TEMPLATE);
		this.status = "not started";
		this.internalRepository = "";
		this.renamedLabel = "";
		this.originalLabel = "";
		this.facadeRegistered = "";
		this.sameCounter = "";
		this.results = {};
	}

	public onMount(): void {
		try {
			this.setUp();
			this.status = "ready";
		} catch (e) {
			const err = e as Error;
			this.status = err.name + ": " + err.message;
		}

		this.refresh();
		this.$c().sync();
	}

	public onUnmount(): void {
		this.removePromotionChild();
	}

	public increment(): void {
		this.getContext().getObject<PromotionCounter>("promotionCounter").increment();
		this.refresh();
	}

	public reregister(): void {
		this.getChild().registerPrototype("promotionWidget", PromotionWidgetB);
		this.refresh();
	}

	public removeChild(): void {
		this.getContext().removeChild(CHILD_NAME);
		this.refresh();
	}

	public promoteUnknown(): void {
		this.capture("promoteUnknown", () => this.getChild().promote("promotionMissing"));
	}

	public promoteInherited(): void {
		this.capture("promoteInherited", () => this.getChild().promote("promotionConsumer"));
	}

	public promoteCollision(): void {
		this.capture("promoteCollision", () => this.getChild().promote("promotionTaken"));
	}

	public promoteTwice(): void {
		this.capture("promoteTwice", () => this.getChild().promote("promotionFacade"));
	}

	public promoteRoot(): void {
		this.capture("promoteRoot", () => this.getContext().getRoot().promote("promotionAnything"));
	}

	private setUp(): void {
		this.removePromotionChild();
		this.getContext().registerConstant("promotionTaken", "taken in the specimen context");

		const child: Context = this.getContext().addChild(CHILD_NAME, promotionCapability);
		child.promote("promotionFacade");
		child.promote("promotionCounter");
		child.promote("promotionWidget");
		child.promote("promotionLabel", "promotionRenamedLabel");
	}

	private refresh(): void {
		const context: Context = this.getContext();
		const regions = this.$c().regions();

		regions.setByObjectId("facadeSlot", "promotionConsumer", "promotionFallback");
		regions.setByObjectId("parentCounterSlot", "promotionCounterView", "promotionFallback");
		if (context.hasChild(CHILD_NAME)) {
			regions.setByObjectId("childCounterSlot", CHILD_NAME + "/promotionCounterView", "promotionFallback");
		} else {
			regions.setByObjectId("childCounterSlot", "promotionFallback");
		}

		regions.setByObjectId("widgetSlot", "promotionWidget", "promotionFallback");

		this.internalRepository = context.hasRegistration("promotionRepository") ? "registered" : "not registered";
		this.renamedLabel = String(context.getObject("promotionRenamedLabel"));
		this.originalLabel = context.hasRegistration("promotionLabel") ? "registered" : "not registered";
		this.facadeRegistered = context.hasRegistration("promotionFacade") ? "registered" : "not registered";
		this.sameCounter = this.describeSameCounter(context);
	}

	private describeSameCounter(context: Context): string {
		let result: string = "no child context";

		if (context.hasChild(CHILD_NAME)) {
			const fromParent: PromotionCounter = context.getObject<PromotionCounter>("promotionCounter");
			const fromChild: PromotionCounter = context.getChild(CHILD_NAME).getObject<PromotionCounter>("promotionCounter");
			result = fromParent === fromChild ? "same instance" : "different instances";
		}

		return result;
	}

	private capture(key: string, fn: () => void): void {
		let result: string;

		try {
			fn();
			result = "(no error thrown)";
		} catch (e) {
			const err = e as Error;
			result = (err && err.name ? err.name : "Error") + ": " + (err ? err.message : "");
		}

		this.results = { ...this.results, [key]: result };
	}

	private removePromotionChild(): void {
		if (this.getContext().hasChild(CHILD_NAME)) {
			this.getContext().removeChild(CHILD_NAME);
		}
	}

	private getContext(): Context {
		return this.$c().getContext();
	}

	private getChild(): Context {
		return this.getContext().getChild(CHILD_NAME);
	}

}

export { PromotionConsumer, PromotionCounterView, PromotionFallback };

export default ContextPromotionSpecimen;
