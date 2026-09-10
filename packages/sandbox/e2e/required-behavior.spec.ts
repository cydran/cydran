import { test, expect } from "@playwright/test";

/**
 * Proves `c-required` toggles the input's `required` property (and the reflected attribute).
 */
test.describe("c-required behavior", () => {
	test("toggles the required property of an input", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Required Behavior" }).click();

		const state = page.getByTestId("state");
		const target = page.getByTestId("target");

		// Initial: not required.
		await expect(state).toHaveText("false");
		await expect(target).toHaveJSProperty("required", false);
		await expect(target).not.toHaveAttribute("required");

		// Toggle on: required (property + reflected attribute).
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("true");
		await expect(target).toHaveJSProperty("required", true);
		await expect(target).toHaveAttribute("required", "");

		// Toggle off: not required again.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("false");
		await expect(target).toHaveJSProperty("required", false);
		await expect(target).not.toHaveAttribute("required");
	});
});
