import { test, expect } from "@playwright/test";

/**
 * Proves `c-style` applies camelCase style properties to the element's inline style.
 * Assertions use computed CSS (font-weight normal -> "400", bold -> "700").
 */
test.describe("c-style behavior", () => {
	test("applies style properties from the model and updates on change", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Style Behavior" }).click();

		const target = page.getByTestId("target");

		// Initial: red, normal weight.
		await expect(target).toHaveCSS("color", "rgb(255, 0, 0)");
		await expect(target).toHaveCSS("font-weight", "400");

		// Toggle: blue, bold.
		await page.getByTestId("toggle").click();
		await expect(target).toHaveCSS("color", "rgb(0, 0, 255)");
		await expect(target).toHaveCSS("font-weight", "700");

		// Toggle back: red, normal.
		await page.getByTestId("toggle").click();
		await expect(target).toHaveCSS("color", "rgb(255, 0, 0)");
		await expect(target).toHaveCSS("font-weight", "400");
	});
});
