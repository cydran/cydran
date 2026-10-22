import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on `<input type="color">` (STRING accessor, `#rrggbb` value).
 * Color inputs aren't fillable in Playwright, so DOM -> model is driven by dispatching a
 * real `input` event with a new value — exactly what the OS color picker does — which the
 * behavior listens for.
 */
test.describe("c-model on a color input", () => {
	test("two-way binds an <input type=color> string value", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (color)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");

		// Model -> DOM: initial value seeds the input and the mirror.
		await expect(input).toHaveValue("#3366ff");
		await expect(output).toHaveText("#3366ff");

		// DOM -> Model: simulate a color pick (set value + fire native input event).
		await input.evaluate((el, colour) => {
			(el as HTMLInputElement).value = colour;
			el.dispatchEvent(new Event("input", { bubbles: true }));
		}, "#ff0000");
		await expect(output).toHaveText("#ff0000");

		// Model -> DOM via event handlers mutating the model.
		await page.getByTestId("model-green").click();
		await expect(input).toHaveValue("#00ff00");
		await expect(output).toHaveText("#00ff00");

		await page.getByTestId("model-black").click();
		await expect(input).toHaveValue("#000000");
		await expect(output).toHaveText("#000000");
	});
});
