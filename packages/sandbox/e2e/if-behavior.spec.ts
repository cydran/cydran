import { test, expect } from "@playwright/test";

/**
 * Proves `c-if` attaches/detaches its element from the DOM based on a truthy
 * expression. Contrast with `c-hidden`, which keeps the element in the DOM.
 */
test.describe("c-if behavior", () => {
	test("adds/removes the element from the DOM as the expression toggles", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "If Behavior" }).click();

		const state = page.getByTestId("state");
		const conditional = page.getByTestId("conditional");

		// Initial: expression truthy -> element present in the DOM.
		await expect(state).toHaveText("true");
		await expect(conditional).toHaveCount(1);
		await expect(conditional).toBeVisible();

		// Toggle off: element is removed from the DOM entirely.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("false");
		await expect(conditional).toHaveCount(0);

		// Toggle on: element is re-inserted.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("true");
		await expect(conditional).toHaveCount(1);
		await expect(conditional).toBeVisible();

		// The sibling without c-if is unaffected throughout.
		await expect(page.getByTestId("always")).toHaveCount(1);
	});
});
