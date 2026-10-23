/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./EventBehaviorSpecimen.html";

/**
 * Specimen: `c-on*` event behaviors. Each element binds a single DOM event via
 * `c-on<event>` and records the received `$event.type` into `fired[<name>]`, mirrored
 * in the DOM so a test can observe which handler ran. `recordKey` additionally captures
 * `$event.key` to prove `p().$event` is the real DOM event with its properties.
 */
const EVENT_NAMES: string[] = [
	"click", "dblclick", "contextmenu", "mousedown", "mouseup",
	"mouseenter", "mouseleave", "mouseover", "mouseout", "mousemove",
	"keydown", "keyup", "input", "change", "focus",
	"blur", "focusin", "focusout", "submit", "wheel",
];

class EventBehaviorSpecimen extends Component {

	private fired: { [name: string]: string };

	private lastKey: string;

	constructor() {
		super(TEMPLATE);
		this.fired = {};
		EVENT_NAMES.forEach((name) => (this.fired[name] = ""));
		this.lastKey = "";
	}

	public record(name: string, event: Event): void {
		this.fired = { ...this.fired, [name]: event.type };
	}

	public recordKey(name: string, event: KeyboardEvent): void {
		this.record(name, event);
		this.lastKey = event.key;
	}

	public onSubmit(event: Event): void {
		// Prevent the browser from navigating/reloading on form submit.
		event.preventDefault();
		this.record("submit", event);
	}

}

export default EventBehaviorSpecimen;
