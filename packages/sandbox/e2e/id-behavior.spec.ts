import { test, expect } from "@playwright/test";

/**
 * Proves `c-id` registers a named element reachable via `$c().forElement(name)`
 * (focus/blur), and that it does NOT set the DOM `id` attribute.
 */
test.describe("c-id behavior", () => {
	test("registers a named element for forElement, without setting a DOM id", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Id Behavior" }).click();

		const target = page.getByTestId("target");

		// c-id does not set the DOM id attribute.
		await expect(target).not.toHaveAttribute("id");

		// Not focused initially.
		await expect(target).not.toBeFocused();

		// forElement("myField").focus() focuses the registered element.
		await page.getByTestId("focus-btn").click();
		await expect(target).toBeFocused();

		// forElement("myField").blur() removes focus.
		await page.getByTestId("blur-btn").click();
		await expect(target).not.toBeFocused();
	});
});
