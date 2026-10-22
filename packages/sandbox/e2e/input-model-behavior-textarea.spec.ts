import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` binding on a `<textarea>` via the
 * "Input Model Behavior (textarea)" specimen (`/specimens/inputModelBehaviorTextarea`).
 *
 * The specimen binds `m().text` to the textarea with `c-model` and mirrors it with
 * `{{m().text}}` / `{{m().text.length}}` interpolation, so the model is observable from
 * the rendered DOM. Multi-line input additionally proves textarea newline preservation.
 */
test.describe("c-model on a textarea", () => {
	test("two-way binds a <textarea> to the component model, preserving newlines", async ({ page }) => {
		await page.goto("/");

		// Navigate: main nav -> Specimens page -> the Input Model Behavior (textarea) specimen.
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (textarea)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");
		const length = page.getByTestId("model-length");

		// Model -> DOM: the initial model value seeds both the textarea and the interpolations.
		await expect(input).toHaveValue("initial");
		await expect(output).toHaveText("initial");
		await expect(length).toHaveText("7");

		// DOM -> Model: multi-line typing drives the model; newlines are preserved end to end.
		await input.fill("line one\nline two");
		await expect(input).toHaveValue("line one\nline two");
		await expect(length).toHaveText("17");

		// Model -> DOM: an event handler mutating the model pushes back into the textarea.
		await page.getByTestId("model-stamp").click();
		await expect(input).toHaveValue("Cydran");
		await expect(output).toHaveText("Cydran");
		await expect(length).toHaveText("6");

		// Clearing the model empties both the textarea and the interpolation.
		await page.getByTestId("model-clear").click();
		await expect(input).toHaveValue("");
		await expect(length).toHaveText("0");
	});
});
