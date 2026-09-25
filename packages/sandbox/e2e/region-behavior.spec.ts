import { test, expect, Page } from "@playwright/test";

/**
 * Proves `RegionBehavior` (`<c-region>`): single-occupancy placement/replacement, clearing,
 * `setByObjectId` (DI placement), `value` surfacing into the child (`v()`), and `lock`.
 */
test.describe("RegionBehavior", () => {
	const slotChild = (page: Page) => page.getByTestId("slot-region").getByTestId("region-child");
	const slotTag = (page: Page) => page.getByTestId("slot-region").getByTestId("child-tag");
	const slotValue = (page: Page) => page.getByTestId("slot-region").getByTestId("child-value");
	const lockedChild = (page: Page) => page.getByTestId("locked-region").getByTestId("region-child");
	const lockedTag = (page: Page) => page.getByTestId("locked-region").getByTestId("child-tag");

	test.beforeEach(async ({ page }: { page: Page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Region Behavior" }).click();
	});

	test("places, replaces (single occupancy), and clears a component", async ({ page }) => {
		// Empty to start.
		await expect(slotChild(page)).toHaveCount(0);

		// Place A.
		await page.getByTestId("set-a").click();
		await expect(slotChild(page)).toHaveCount(1);
		await expect(slotTag(page)).toHaveText("A");

		// Replace with B -> still exactly one component (single occupancy).
		await page.getByTestId("set-b").click();
		await expect(slotChild(page)).toHaveCount(1);
		await expect(slotTag(page)).toHaveText("B");

		// Clear -> empty.
		await page.getByTestId("clear-slot").click();
		await expect(slotChild(page)).toHaveCount(0);
	});

	test("places a component resolved by object id (setByObjectId)", async ({ page }) => {
		await page.getByTestId("set-di").click();
		await expect(slotChild(page)).toHaveCount(1);
		await expect(slotTag(page)).toHaveText("DI");
	});

	test("surfaces the region value into the child and updates it reactively", async ({ page }) => {
		// Place a child; the region's value="m().payload" surfaces into v().
		await page.getByTestId("set-a").click();
		await expect(slotValue(page)).toHaveText("alpha");

		// Change the parent payload -> the surfaced v() value updates in the child.
		await page.getByTestId("change-payload").click();
		await expect(slotValue(page)).toHaveText("beta");
	});

	test("a locked region rejects replacement", async ({ page }) => {
		// Seeded in onMount.
		await expect(lockedChild(page)).toHaveCount(1);
		await expect(lockedTag(page)).toHaveText("locked-original");

		// Attempting to replace throws LockedRegionError (caught in the model).
		await page.getByTestId("try-replace-locked").click();
		await expect(page.getByTestId("lock-error")).toHaveText("true");

		// Original component is still in place.
		await expect(lockedChild(page)).toHaveCount(1);
		await expect(lockedTag(page)).toHaveText("locked-original");
	});
});
