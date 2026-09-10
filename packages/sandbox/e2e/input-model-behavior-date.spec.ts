import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on `<input type="date">` binds a real `Date` object into the
 * model (DATE accessor strategy, `el.valueAsDate`), and that clearing yields `null`.
 * `typeName()` asserts the model holds a `Date`, not a formatted string.
 */
test.describe("c-model on a date input", () => {
	test("two-way binds an <input type=date>, model holds a Date (or null)", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (date)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");
		const type = page.getByTestId("model-type");

		// Model -> DOM: the initial Date seeds the input; the model is a real Date.
		await expect(input).toHaveValue("2024-01-15");
		await expect(output).toHaveText("2024-01-15");
		await expect(type).toHaveText("Date");

		// DOM -> Model: picking a date drives the model (still a Date). Driven by a
		// dispatched native `input` event (deterministic, as a date picker emits).
		await input.evaluate((el) => {
			(el as HTMLInputElement).value = "2024-06-30";
			el.dispatchEvent(new Event("input", { bubbles: true }));
		});
		await expect(output).toHaveText("2024-06-30");
		await expect(type).toHaveText("Date");

		// Model -> DOM via an event handler mutating the model.
		await page.getByTestId("model-stamp").click();
		await expect(input).toHaveValue("2024-12-25");
		await expect(output).toHaveText("2024-12-25");
		await expect(type).toHaveText("Date");

		// Clearing sets the model to null and empties the input.
		await page.getByTestId("model-clear").click();
		await expect(input).toHaveValue("");
		await expect(output).toHaveText("null");
		await expect(type).toHaveText("null");
	});
});
