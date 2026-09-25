import { test, expect } from "@playwright/test";

/**
 * Proves `AttributeBehavior` binds a plain attribute (`title`) to a model expression:
 * `{{ }}` reactive (updates on change), `[[ ]]` immutable (frozen at mount).
 */
test.describe("AttributeBehavior", () => {
	test("binds an attribute reactively ({{ }}) and immutably ([[ ]])", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Attribute Behavior" }).click();

		const state = page.getByTestId("state");
		const reactive = page.getByTestId("reactive");
		const immutable = page.getByTestId("immutable");

		// Initial: both attributes reflect the model value; the literal {{ }}/[[ ]] is gone.
		await expect(state).toHaveText("initial title");
		await expect(reactive).toHaveAttribute("title", "initial title");
		await expect(immutable).toHaveAttribute("title", "initial title");

		// Change the model: reactive attribute updates; immutable stays frozen.
		await page.getByTestId("change").click();
		await expect(state).toHaveText("changed title");
		await expect(reactive).toHaveAttribute("title", "changed title");
		await expect(immutable).toHaveAttribute("title", "initial title"); // never updates
	});
});
