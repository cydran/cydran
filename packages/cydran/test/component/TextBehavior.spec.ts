/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { JSDOM } from "jsdom";
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import TextBehavior from 'behavior/core/TextBehavior';
import BehaviorTransitions from "behavior/BehaviorTransitions";
import { describe, expect, test } from '@jest/globals';
import GlobalContextImpl from "context/GlobalContextImpl";

expect(GlobalContextImpl).not.toBeNull();

const windowInstance = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;

const dependencies: BehaviorDependencies = {
	el: windowInstance.document.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	validated: false,
	mutable: true
};

describe("TextBehavior", () => {
	
	test("Constructor - with dependencies", () => {
		const specimen = new TextBehavior();
		specimen.tell(BehaviorTransitions.INIT, dependencies);
		expect(specimen).not.toBeNull();
	});
	
});
