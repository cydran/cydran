import { test, expect } from "@playwright/test";

/**
 * Documents the current behavior of `c-validated`: it is an unimplemented stub
 * (`ValidatedBehavior.onMount()` is a TODO), so it mounts without error and is a no-op —
 * the element it decorates stays fully functional (the co-located c-model still works).
 * Update this test when validation is implemented.
 */
test.describe("c-validated behavior (currently a no-op stub)", () => {
	test("mounts without error and does not interfere with the element", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Validated Behavior" }).click();

		const target = page.getByTestId("target");
		const output = page.getByTestId("model-output");

		// The decorated element renders and is interactive (proves c-validated didn't error).
		await expect(target).toBeVisible();
		await expect(target).toBeEditable();
		await expect(target).toHaveValue("editable");

		// The co-located c-model still functions (c-validated is a no-op, not interfering).
		await target.fill("changed");
		await expect(output).toHaveText("changed");
	});
});
