import { test, expect } from "@playwright/test";

/**
 * Proves `c-checked` two-way binds a checkbox to a boolean model field: DOM -> model
 * (clicking the box) and model -> DOM (mutating the model).
 */
test.describe("c-checked behavior", () => {
	test("two-way binds a checkbox to a boolean model field", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Checked Behavior" }).click();

		const target = page.getByTestId("target");
		const state = page.getByTestId("state");

		// Initial: unchecked, model false.
		await expect(target).not.toBeChecked();
		await expect(state).toHaveText("false");

		// DOM -> model: checking the box updates the model.
		await target.check();
		await expect(target).toBeChecked();
		await expect(state).toHaveText("true");

		// DOM -> model: unchecking updates the model.
		await target.uncheck();
		await expect(target).not.toBeChecked();
		await expect(state).toHaveText("false");

		// model -> DOM: mutating the model updates the checkbox.
		await page.getByTestId("model-toggle").click();
		await expect(target).toBeChecked();
		await expect(state).toHaveText("true");

		await page.getByTestId("model-toggle").click();
		await expect(target).not.toBeChecked();
		await expect(state).toHaveText("false");
	});
});
