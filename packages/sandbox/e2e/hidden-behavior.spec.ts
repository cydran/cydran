import { test, expect } from "@playwright/test";

/**
 * Proves `c-hidden` sets the element's `hidden` property while keeping it in the DOM
 * (the distinction from `c-if`, which removes it).
 */
test.describe("c-hidden behavior", () => {
	test("toggles the hidden property but keeps the element in the DOM", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Hidden Behavior" }).click();

		const state = page.getByTestId("state");
		const target = page.getByTestId("target");

		// Initial: not hidden -> visible and present.
		await expect(state).toHaveText("false");
		await expect(target).toBeVisible();
		await expect(target).toHaveJSProperty("hidden", false);

		// Toggle on: hidden, but still in the DOM (count stays 1).
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("true");
		await expect(target).toBeHidden();
		await expect(target).toHaveJSProperty("hidden", true);
		await expect(target).toHaveCount(1);

		// Toggle off: visible again.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("false");
		await expect(target).toBeVisible();
		await expect(target).toHaveJSProperty("hidden", false);
	});
});
