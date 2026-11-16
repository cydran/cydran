/**
 * @jest-environment jsdom
 */
/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import {
	Component,
	ConstructorArgument,
	Context,
	InstanceArgument,
	ListItem,
	LogArgument,
	MessagePayload,
	ModelValue,
	PropertyValue,
	ScopeItem,
	Stage,
	To,
	argumentsBuilder,
	create
} from "@cydran/cydran";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";

const CHANNEL_NAME: string = "standardTypes";

const MESSAGE_NAME: string = "delivered";

class Receiver extends Component {

	private received: MessagePayload[];

	constructor() {
		super("<div></div>");
		this.received = [];
		this.$c().onMessage(MESSAGE_NAME).forChannel(CHANNEL_NAME).invoke("onDelivered");
	}

	public publish(payload: MessagePayload): void {
		this.$c().send(MESSAGE_NAME, payload).onChannel(CHANNEL_NAME).withPropagation(To.GLOBALLY);
	}

	public getReceived(): MessagePayload[] {
		return this.received;
	}

	public onDelivered(payload: MessagePayload): void {
		this.received.push(payload);
	}

}

class ScopeLabel extends Component {

	constructor() {
		super('<p data-testid="scope-label">{{s().standardTypesLabel.text}}</p>');
	}

}

class Greeting {

	private text: string;

	constructor(text: ConstructorArgument) {
		this.text = String(text);
	}

	public getText(): string {
		return this.text;
	}

}

let stage: Stage = null as unknown as Stage;
let root: Context = null as unknown as Context;

describe("Standard types through the published package", () => {
	beforeEach(() => {
		stage = create("body", {
			"cydran.startup.synchronous": true
		});
		stage.start();
		root = stage.getContext();
	});

	afterEach(() => {
		stage.$release();
		stage = null as unknown as Stage;
		root = null as unknown as Context;
	});

	test("a handler typed with MessagePayload receives a sent payload", () => {
		root.registerSingleton("receiver", Receiver);
		const receiver: Receiver = root.getObject<Receiver>("receiver");
		stage.setComponent(receiver);
		const payload: MessagePayload = { order: 42 };

		receiver.publish(payload);

		expect(receiver.getReceived()).toEqual([{ order: 42 }]);
	});

	test("instance arguments and constructor arguments carry any value", () => {
		root.registerPrototype("greeting", Greeting, argumentsBuilder().withArgument(0).build());
		const instanceArguments: InstanceArgument[] = ["hello"];

		const greeting: Greeting = root.getObject<Greeting>("greeting", ...instanceArguments);

		expect(greeting.getText()).toBe("hello");
	});

	test("property values and scope items carry any value", () => {
		const limit: PropertyValue = 10;
		const label: ScopeItem = { text: "label" };

		root.getProperties().set("standardTypes.limit", limit);
		root.getScope().add("standardTypesLabel", label);

		root.registerPrototype("scopeLabel", ScopeLabel);
		stage.setComponentByObjectId("scopeLabel");

		expect(root.getProperties().get("standardTypes.limit")).toBe(10);
		expect(document.querySelector('[data-testid="scope-label"]')?.textContent).toBe("label");
	});

	test("log arguments, model values and list items accept any value", () => {
		const logArguments: LogArgument[] = ["text", 1, null, { key: "value" }];
		const modelValue: ModelValue = "model";
		const items: ListItem[] = [{ id: 1 }, "two", 3];

		expect(logArguments).toHaveLength(4);
		expect(modelValue).toBe("model");
		expect(items).toHaveLength(3);
	});
});
