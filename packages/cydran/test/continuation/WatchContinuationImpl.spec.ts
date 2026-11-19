/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { assertNullGuarded } from "test/TestUtils";
import WatchContinuation from "continuation/WatchContinuation";
import WatchContinuationImpl from "continuation/WatchContinuationImpl";
import ComponentInternals from "component/ComponentInternals";
import { ModelValue } from "CydranTypes";
import { describe, expect, jest, test } from "@jest/globals";

const EXPRESSION: string = "m().count";

const COMPONENT: object = {};

function createInternals(): { internals: ComponentInternals; watch: jest.Mock } {
	const watch: jest.Mock = jest.fn();
	const internals: ComponentInternals = { watch: watch } as unknown as ComponentInternals;

	return { internals: internals, watch: watch };
}

describe("WatchContinuationImpl", () => {
	test("constructor - null internals", () => {
		assertNullGuarded(
			"internals",
			() => new WatchContinuationImpl(null as unknown as ComponentInternals, COMPONENT, EXPRESSION)
		);
	});

	test("constructor - null component", () => {
		assertNullGuarded(
			"component",
			() => new WatchContinuationImpl(createInternals().internals, null as unknown as object, EXPRESSION)
		);
	});

	test("constructor - null expression", () => {
		assertNullGuarded(
			"expression",
			() => new WatchContinuationImpl(createInternals().internals, COMPONENT, null as unknown as string)
		);
	});

	test("reducedBy() - null reducerFn", () => {
		const specimen: WatchContinuation = new WatchContinuationImpl(createInternals().internals, COMPONENT, EXPRESSION);

		assertNullGuarded("reducerFn", () => specimen.reducedBy(null as unknown as (input: ModelValue) => string));
	});

	test("reducedBy() - returns the same continuation", () => {
		const specimen: WatchContinuation = new WatchContinuationImpl(createInternals().internals, COMPONENT, EXPRESSION);

		const result: WatchContinuation = specimen.reducedBy((input: ModelValue) => String(input));

		expect(result).toBe(specimen);
	});

	test("invoke() - passes the expression, component, name and reducer to watch", () => {
		const { internals, watch } = createInternals();
		const reducerFn: (input: ModelValue) => string = (input: ModelValue) => "n" + String(input);
		const specimen: WatchContinuation = new WatchContinuationImpl(internals, COMPONENT, EXPRESSION);

		specimen.reducedBy(reducerFn).invoke("onCountChange");

		expect(watch).toHaveBeenCalledTimes(1);
		expect(watch).toHaveBeenCalledWith(EXPRESSION, COMPONENT, "onCountChange", reducerFn);
	});

	test("invoke() - without a reducer passes undefined", () => {
		const { internals, watch } = createInternals();
		const specimen: WatchContinuation = new WatchContinuationImpl(internals, COMPONENT, EXPRESSION);

		specimen.invoke("onCountChange");

		expect(watch).toHaveBeenCalledWith(EXPRESSION, COMPONENT, "onCountChange", undefined);
	});
});
