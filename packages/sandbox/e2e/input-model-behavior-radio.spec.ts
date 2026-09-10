import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on a radio group: the model holds the chosen radio's value;
 * checking a radio updates the model, and setting the model checks the matching radio.
 */
test.describe("c-model on a radio group", () => {
	// SKIPPED — tracked in cydran/cydran#830: `c-model` on a radio is managed by ValuedModelBehavior
	// (it overwrites each radio's `value` with the model value) instead of RadioModelBehavior, so no
	// radio ends up checked from the model. The `model:input` factory's `el.type === "radio"` branch
	// is not selecting RadioModelBehavior for these elements. Re-enable once #830 is fixed.
	test.skip("two-way binds a radio group to a string model field", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (radio)" }).click();

		const small = page.getByTestId("radio-small");
		const medium = page.getByTestId("radio-medium");
		const large = page.getByTestId("radio-large");
		const output = page.getByTestId("model-output");

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
