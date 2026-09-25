import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` binding on an `<input type="text">` via the
 * "Input Model Behavior (text)" specimen (`/specimens/inputModelBehaviorText`).
 *
 * The specimen binds `m().text` to the input with `c-model` and mirrors it with
 * `{{m().text}}` / `{{m().text.length}}` interpolation, so the model is observable
 * from the rendered DOM. Buttons mutate the model to exercise the model -> DOM path.
 */
test.describe("c-model on a text input", () => {
	test("two-way binds an <input type=text> to the component model", async ({ page }) => {
		await page.goto("/");

		// Navigate: main nav -> Specimens page -> the Input Model Behavior (text) specimen.
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (text)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");
		const length = page.getByTestId("model-length");

		// Model -> DOM: the initial model value seeds both the input and the interpolations.
		await expect(input).toHaveValue("initial");
		await expect(output).toHaveText("initial");
		await expect(length).toHaveText("7");

		// DOM -> Model: typing drives the model, reflected in the interpolations.
		await input.fill("hello");
		await expect(output).toHaveText("hello");
		await expect(length).toHaveText("5");

		// Model -> DOM: an event handler mutating the model pushes back into the input.
		await page.getByTestId("model-stamp").click();
		await expect(input).toHaveValue("Cydran");
		await expect(output).toHaveText("Cydran");
		await expect(length).toHaveText("6");

		// Clearing the model empties both the input and the interpolation.
		await page.getByTestId("model-clear").click();
		await expect(input).toHaveValue("");
		await expect(output).toHaveText("");
		await expect(length).toHaveText("0");
	});
});
