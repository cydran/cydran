import { test, expect } from "@playwright/test";

/**
 * Proves `c-readonly` toggles the input's `readOnly` property (editable vs read-only).
 */
test.describe("c-readonly behavior", () => {
	test("toggles the readOnly property of an input", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Read Only Behavior" }).click();

		const state = page.getByTestId("state");
		const target = page.getByTestId("target");

		// Initial: not read-only -> editable.
		await expect(state).toHaveText("false");
		await expect(target).toBeEditable();
		await expect(target).toHaveJSProperty("readOnly", false);

		// Toggle on: read-only.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("true");
		await expect(target).not.toBeEditable();
		await expect(target).toHaveJSProperty("readOnly", true);

		// Toggle off: editable again.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("false");
		await expect(target).toBeEditable();
		await expect(target).toHaveJSProperty("readOnly", false);
	});
});
