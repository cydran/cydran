import { test, expect } from "@playwright/test";

/**
 * Proves `c-inert` toggles the element's `inert` property (and reflected attribute).
 */
test.describe("c-inert behavior", () => {
	test("toggles the inert property of a region", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Inert Behavior" }).click();

		const state = page.getByTestId("state");
		const target = page.getByTestId("target");

		// Initial: not inert.
		await expect(state).toHaveText("false");
		await expect(target).toHaveJSProperty("inert", false);
		await expect(target).not.toHaveAttribute("inert");

		// Toggle on: inert (property + reflected attribute).
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("true");
		await expect(target).toHaveJSProperty("inert", true);
		await expect(target).toHaveAttribute("inert", "");

		// Toggle off: not inert again.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("false");
		await expect(target).toHaveJSProperty("inert", false);
		await expect(target).not.toHaveAttribute("inert");
	});
});
