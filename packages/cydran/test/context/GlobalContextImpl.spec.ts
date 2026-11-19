/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { assertNullGuarded } from "test/TestUtils";
import GlobalContextImpl from "context/GlobalContextImpl";
import { UnsupportedOperationError } from "error/Errors";

const INV_ID: string = "Invalid /id!";

describe("GlobalContextImpl.promote()", () => {
	let specimen: GlobalContextImpl = null;

	beforeEach(() => {
		specimen = new GlobalContextImpl();
	});

	afterEach(() => {
		specimen = null;
	});

	test("throws UnsupportedOperationError and registers nothing", () => {
		specimen.registerConstant("thing", "value");

		expect(() => specimen.promote("thing")).toThrow(UnsupportedOperationError);
		expect(() => specimen.promote("thing", "renamed")).toThrow("The global context has no parent to promote into");
		expect(specimen.hasRegistration("renamed")).toBe(false);
	});

	test("null id - fails with the id validation error first", () => {
		assertNullGuarded("id", () => specimen.promote(null));
	});

	test("invalid id - fails with the id validation error first", () => {
		assertNullGuarded("id must be valid", () => specimen.promote(INV_ID), "ValidationError");
	});

	test("invalid override id - fails with the id validation error first", () => {
		assertNullGuarded("overrideId must be valid", () => specimen.promote("thing", INV_ID), "ValidationError");
	});
});
