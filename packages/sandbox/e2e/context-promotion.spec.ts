/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { test, expect, Page } from "@playwright/test";

/**
 * Proves `Context.promote` in a browser: a child context's facade is promoted into the specimen's context and
 * resolved there by id (injected into a DI-resolved component in a region), an override id, one singleton across
 * both contexts, re-registration, removal with `removeChild`, and each promote failure by error class and message.
 */
test.describe("Context promotion", () => {
	async function open(page: Page): Promise<void> {
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "DI: promote" }).click();
		await expect(page.getByTestId("status")).toHaveText("ready");
	}

	test.beforeEach(async ({ page }: { page: Page }) => {
		await page.goto("/");
		await open(page);
	});

	test("a component in the parent is injected with the promoted facade", async ({ page }) => {
		await expect(page.getByTestId("facade-slot").getByTestId("consumer-text")).toHaveText("Facade over internal billing");
		await expect(page.getByTestId("facade-registered")).toHaveText("registered");
	});

	test("the facade's internal dependency is not registered in the parent", async ({ page }) => {
		await expect(page.getByTestId("internal-repository")).toHaveText("not registered");
	});

	test("an override id is registered in the parent instead of the original id", async ({ page }) => {
		await expect(page.getByTestId("renamed-label")).toHaveText("label from the child context");
		await expect(page.getByTestId("original-label")).toHaveText("not registered");
	});

	test("a promoted singleton is one instance in both contexts", async ({ page }) => {
		const parentCounter = page.getByTestId("parent-counter").getByTestId("counter-value");
		const childCounter = page.getByTestId("child-counter").getByTestId("counter-value");

		await expect(page.getByTestId("same-counter")).toHaveText("same instance");
		await expect(parentCounter).toHaveText("0");
		await expect(childCounter).toHaveText("0");

		await page.getByTestId("btn-increment").click();
		await page.getByTestId("btn-increment").click();

		await expect(parentCounter).toHaveText("2");
		await expect(childCounter).toHaveText("2");
	});

	test("the parent resolves the child's re-registration", async ({ page }) => {
		const widget = page.getByTestId("widget-slot").getByTestId("widget-text");

		await expect(widget).toHaveText("Widget A");

		await page.getByTestId("btn-reregister").click();

		await expect(widget).toHaveText("Widget B");
	});

	test("removeChild removes the promoted aliases from the parent", async ({ page }) => {
		await page.getByTestId("btn-remove-child").click();

		await expect(page.getByTestId("widget-slot").getByTestId("widget-text")).toHaveText("No widget");
		await expect(page.getByTestId("facade-slot").getByTestId("consumer-text")).toHaveText("No facade");
		await expect(page.getByTestId("facade-registered")).toHaveText("not registered");
		await expect(page.getByTestId("same-counter")).toHaveText("no child context");
	});

	test("each failure throws its error class and message", async ({ page }) => {
		const expected: Array<{ key: string; name: string; message: string }> = [
			{
				key: "promoteUnknown",
				name: "RegistrationError",
				message: "has no registration of its own with id: promotionMissing"
			},
			{
				key: "promoteInherited",
				name: "RegistrationError",
				message: "has no registration of its own with id: promotionConsumer"
			},
			{ key: "promoteCollision", name: "RegistrationError", message: "already registered with id: promotionTaken" },
			{ key: "promoteTwice", name: "RegistrationError", message: "already registered with id: promotionFacade" },
			{ key: "promoteRoot", name: "UnsupportedOperationError", message: "A root context has no parent to promote into" }
		];

		for (const { key, name, message } of expected) {
			await page.getByTestId(`btn-${key}`).click();
			const result = page.getByTestId(`res-${key}`);
			await expect(result, `${key} error class`).toContainText(name);
			await expect(result, `${key} error message`).toContainText(message);
		}
	});

	test("revisiting the specimen starts clean, with no aliases left behind", async ({ page }) => {
		await page.getByTestId("btn-increment").click();
		await page.getByRole("link", { name: "Error Catalog" }).click();
		await expect(page.getByTestId("btn-templateMultiNode")).toBeVisible();

		await page.getByRole("link", { name: "DI: promote" }).click();

		await expect(page.getByTestId("status")).toHaveText("ready");
		await expect(page.getByTestId("facade-slot").getByTestId("consumer-text")).toHaveText("Facade over internal billing");
		await expect(page.getByTestId("parent-counter").getByTestId("counter-value")).toHaveText("0");
	});
});
