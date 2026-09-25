import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on `<select multiple>`: the model holds an array of selected
 * option values; multi-selecting updates the array, and setting the array updates the
 * selection.
 */
test.describe("c-model on a multiple select", () => {
	test("two-way binds a <select multiple> to an array model field", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (select multiple)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");
		const count = page.getByTestId("model-count");

		// Model -> DOM: initial array seeds the selection + mirror.
		await expect(output).toHaveText("green");
		await expect(count).toHaveText("1");
		await expect(input).toHaveValues(["green"]);

		// DOM -> Model: selecting multiple options builds the model array.
		await input.selectOption(["red", "yellow"]);
		await expect(count).toHaveText("2");
		await expect(output).toHaveText("red, yellow");

		// Model -> DOM: setting the array updates which options are selected.
		await page.getByTestId("model-set").click();
		await expect(input).toHaveValues(["red", "blue"]);
		await expect(output).toHaveText("red, blue");

		// Clearing empties the model and deselects all.
		await page.getByTestId("model-clear").click();
		await expect(count).toHaveText("0");
		await expect(input).toHaveValues([]);
	});
});
