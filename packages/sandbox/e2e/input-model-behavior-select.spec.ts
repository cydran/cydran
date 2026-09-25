import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on a single `<select>`: the model holds the selected option's
 * string value; selecting updates the model, and mutating the model updates the selection.
 */
test.describe("c-model on a single select", () => {
	test("two-way binds a <select> to a string model field", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (select single)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");

		// Model -> DOM: initial value seeds the select + mirror.
		await expect(input).toHaveValue("green");
		await expect(output).toHaveText("green");

		// DOM -> Model: choosing an option updates the model.
		await input.selectOption("red");
		await expect(output).toHaveText("red");

		// Model -> DOM: mutating the model updates the selection.
		await page.getByTestId("model-blue").click();
		await expect(input).toHaveValue("blue");
		await expect(output).toHaveText("blue");
	});
});
