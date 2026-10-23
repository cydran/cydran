/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Messages from "util/Messages";

let specimen: Messages = null;
beforeEach(() => {
	specimen = new Messages();
	specimen.add("first error");
	specimen.add("second error");
	specimen.add("third error");
});

afterEach(() => {
	specimen = null;
});

test("Messages constructor", () => {
	expect(specimen).not.toBeNull();
});

test("Messages getMessages()", () => {
	specimen.add(null);
	specimen.add("fourth error");

	const result: string = specimen.getMessages();

	expect(result).toEqual(`Errors:
	- first error
	- second error
	- third error
	- fourth error
`);
});

test("Messages hasMessages - with messages()", () => {
	expect(specimen.hasMessages()).toBeTruthy();
});

test("Messages hasMessages() - without messages", () => {
	specimen.clear();

	expect(specimen.hasMessages()).toBeFalsy();
});

test("Messages hasMessages() - with messages never added", () => {
	const wkSpecimen: Messages = new Messages();

	expect(wkSpecimen.hasMessages()).toBeFalsy();
});

test("Messages getMessages() - with messages", () => {
	const result: string[] = [];
	specimen.ifMessages((message) => result.push(message));

	expect(result[0]).toEqual(`Errors:
	- first error
	- second error
	- third error
`);
});

test("Messages getMessages() - without messages", () => {
	specimen.clear();

	let result: boolean = false;
	specimen.ifMessages((message) => result = true);

	expect(result).toBeFalsy();
});

test("Messages getMessages() - without messages never added", () => {
	const wkSpecimen: Messages = new Messages();

	let result: boolean = false;
	wkSpecimen.ifMessages((message) => result = true);

	expect(result).toBeFalsy();
});

test("Messages addIf()", () => {
	const wkSpecimen: Messages = new Messages();
	wkSpecimen.addIf(true, () => "first error");
	wkSpecimen.addIf(false, () => "second error");
	wkSpecimen.addIf(true, () => "third error");

	expect(wkSpecimen.getMessages()).toEqual(`Errors:
	- first error
	- third error
`);
});
