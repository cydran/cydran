import { test, expect } from "@playwright/test";

/**
 * Proves `c-class` toggles mapped classes by their truthy value and preserves
 * classes not named in the map.
 */
test.describe("c-class behavior", () => {
	test("toggles mapped classes while preserving unmapped ones", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "CSS Class Behavior" }).click();

		const target = page.getByTestId("target");

		// Initial: neither mapped class present; base classes preserved.
		await expect(target).toHaveClass(/base-class/);
		await expect(target).toHaveClass(/tag/);
		await expect(target).not.toHaveClass(/is-active/);
		await expect(target).not.toHaveClass(/is-danger/);

		// Toggle active on.
		await page.getByTestId("toggle-active").click();
		await expect(target).toHaveClass(/is-active/);
		await expect(target).not.toHaveClass(/is-danger/);
		await expect(target).toHaveClass(/base-class/); // preserved

		// Toggle danger on (both now present).
		await page.getByTestId("toggle-danger").click();
		await expect(target).toHaveClass(/is-active/);
		await expect(target).toHaveClass(/is-danger/);

		// Toggle active off (only danger remains); base class still preserved.
		await page.getByTestId("toggle-active").click();
		await expect(target).not.toHaveClass(/is-active/);
		await expect(target).toHaveClass(/is-danger/);
		await expect(target).toHaveClass(/base-class/);
	});
});
