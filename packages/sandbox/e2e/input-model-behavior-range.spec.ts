import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` on `<input type="range">` (NUMBER accessor strategy).
 * Range inputs aren't fillable in Playwright and synthetic key presses don't reliably
 * emit `input`, so DOM -> model is driven by dispatching a native `input` event with the
 * new value — exactly what a slider drag emits — which the behavior binds to.
 */
test.describe("c-model on a range input", () => {
	test("two-way binds an <input type=range>, model holds a number", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (range)" }).click();

		const input = page.getByTestId("model-input");
		const output = page.getByTestId("model-output");
		const plusOne = page.getByTestId("model-plusone");

		// Model -> DOM: initial value seeds the slider and mirrors.
		await expect(input).toHaveValue("50");
		await expect(output).toHaveText("50");
		await expect(plusOne).toHaveText("51");

		// DOM -> Model: dispatch native `input` events (as a slider drag would).
		const setRange = (n: number) =>
			input.evaluate((el, v) => {
				(el as HTMLInputElement).value = String(v);
				el.dispatchEvent(new Event("input", { bubbles: true }));
			}, n);

		await setRange(100);
		await expect(input).toHaveValue("100");
		await expect(output).toHaveText("100");

		await setRange(0);
		await expect(input).toHaveValue("0");
		await expect(output).toHaveText("0");

		await setRange(1);
		await expect(output).toHaveText("1");
		await expect(plusOne).toHaveText("2");

		// Model -> DOM via an event handler mutating the model.
		await page.getByTestId("model-stamp").click();
		await expect(input).toHaveValue("75");
		await expect(output).toHaveText("75");
		await expect(plusOne).toHaveText("76");
	});
});
