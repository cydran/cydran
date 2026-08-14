import { test, expect } from "@playwright/test";

/**
 * Proves `c-enabled` enables/disables form controls (sets `el.disabled = !value`).
 */
test.describe("c-enabled behavior", () => {
	test("enables/disables controls as the expression toggles", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Enabled Behavior" }).click();

		const state = page.getByTestId("state");
		const input = page.getByTestId("target-input");
		const button = page.getByTestId("target-button");

		// Initial: enabled.
		await expect(state).toHaveText("true");
		await expect(input).toBeEnabled();
		await expect(button).toBeEnabled();

		// Toggle off: disabled.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("false");
		await expect(input).toBeDisabled();
		await expect(button).toBeDisabled();

		// Toggle on: enabled again.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("true");
		await expect(input).toBeEnabled();
		await expect(button).toBeEnabled();
	});
});
