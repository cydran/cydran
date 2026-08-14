import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on `<input type="number">` binds a real `number` into the
 * model (NUMBER accessor strategy, `el.valueAsNumber`). The `{{m().value + 1}}` mirror
 * distinguishes numeric (43) from string ("421") binding.
 */
test.describe("c-model on a number input", () => {
	test("two-way binds an <input type=number>, model holds a number", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (number)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");
		const plusOne = page.getByTestId("model-plusone");

		// Model -> DOM: initial numeric value seeds the input and both mirrors.
		await expect(input).toHaveValue("42");
		await expect(output).toHaveText("42");
		await expect(plusOne).toHaveText("43"); // numeric add, not "421"

		// DOM -> Model: typing an integer.
		await input.fill("7");
		await expect(output).toHaveText("7");
		await expect(plusOne).toHaveText("8");

		// DOM -> Model: a decimal value.
		await input.fill("3.5");
		await expect(output).toHaveText("3.5");
		await expect(plusOne).toHaveText("4.5");

		// Model -> DOM via event handlers mutating the model.
		await page.getByTestId("model-stamp").click();
		await expect(input).toHaveValue("100");
		await expect(output).toHaveText("100");
		await expect(plusOne).toHaveText("101");

		await page.getByTestId("model-zero").click();
		await expect(input).toHaveValue("0");
		await expect(output).toHaveText("0");
		await expect(plusOne).toHaveText("1");
	});
});
