import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on a radio group: the model holds the chosen radio's value;
 * checking a radio updates the model, and setting the model checks the matching radio.
 */
test.describe("c-model on a radio group", () => {
	// Regression guard for cydran/cydran#830: `c-model` on a radio input must bind via
	// RadioModelBehavior (model holds the chosen radio's value; the model drives which radio is
	// checked), NOT ValuedModelBehavior (which overwrites each radio's `value` with the model value
	// and never checks a radio). The root cause was the `model:input` factory reading `el.type` off
	// the resolved-arguments array instead of the element, so the `type === "radio"` branch never fired.
	test("two-way binds a radio group to a string model field", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (radio)" }).click();

		const small = page.getByTestId("radio-small");
		const medium = page.getByTestId("radio-medium");
		const large = page.getByTestId("radio-large");
		const output = page.getByTestId("model-output");

		// Root-cause pin: each radio must keep its own distinct `value`. Under the #830 bug
		// (ValuedModelBehavior on radios) these all get overwritten to the model value ("medium").
		await expect(small).toHaveValue("small");
		await expect(medium).toHaveValue("medium");
		await expect(large).toHaveValue("large");

		// Model -> DOM: initial value checks the matching radio.
		await expect(output).toHaveText("medium");
		await expect(medium).toBeChecked();
		await expect(small).not.toBeChecked();

		// DOM -> Model: checking a radio sets the model to its value.
		await small.check();
		await expect(output).toHaveText("small");
		await expect(small).toBeChecked();
		await expect(medium).not.toBeChecked();

		// Model -> DOM: mutating the model checks the matching radio.
		await page.getByTestId("model-large").click();
		await expect(output).toHaveText("large");
		await expect(large).toBeChecked();
		await expect(small).not.toBeChecked();
	});
});
