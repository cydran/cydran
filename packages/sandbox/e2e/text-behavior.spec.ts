import { test, expect } from "@playwright/test";

/**
 * Proves `TextBehavior` interpolation: `{{ }}` is reactive, `[[ ]]` is immutable, numbers
 * and expressions render as strings, and multiple interpolations share one text node.
 */
test.describe("TextBehavior interpolation", () => {
	test("renders reactive {{ }}, immutable [[ ]], expressions, and multiple per node", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Text Behavior" }).click();

		const reactiveName = page.getByTestId("reactive-name");
		const immutableName = page.getByTestId("immutable-name");
		const count = page.getByTestId("count");
		const expr = page.getByTestId("expr");
		const multi = page.getByTestId("multi");

		// Initial render.
		await expect(reactiveName).toHaveText("Ada");
		await expect(immutableName).toHaveText("Ada");
		await expect(count).toHaveText("3");
		await expect(expr).toHaveText("6"); // 3 * 2
		await expect(multi).toHaveText("Ada has 3 items");

		// Rename: reactive updates, immutable stays frozen at its mount-time value.
		await page.getByTestId("rename").click();
		await expect(reactiveName).toHaveText("Grace");
		await expect(immutableName).toHaveText("Ada"); // never updates

		// Increment: number and expression interpolations update.
		await page.getByTestId("increment").click();
		await expect(count).toHaveText("4");
		await expect(expr).toHaveText("8"); // 4 * 2

		// Both reactive parts of the multi-expression node reflect the new state.
		await expect(multi).toHaveText("Grace has 4 items");
	});
});
