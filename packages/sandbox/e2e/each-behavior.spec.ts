import { test, expect, Page } from "@playwright/test";

/**
 * Proves `c-each` list rendering: item/empty/first/last slots, add/remove/reorder
 * reconciliation, and alt-vs-item selection via `c-test`.
 */
test.describe("c-each behavior", () => {
	const items = (page: Page) => page.getByTestId("each-item");
	const empty = (page: Page) => page.getByTestId("each-empty");
	const first = (page: Page) => page.getByTestId("each-first");
	const last = (page: Page) => page.getByTestId("each-last");
	const count = (page: Page) => page.getByTestId("count");

	test.beforeEach(async ({ page }: { page: Page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Each Behavior" }).click();
	});

	test("empty array shows the empty slot and no items/first/last", async ({ page }) => {
		await expect(count(page)).toHaveText("0");
		await expect(items(page)).toHaveCount(0);
		await expect(empty(page)).toHaveCount(1);
		await expect(first(page)).toHaveCount(0);
		await expect(last(page)).toHaveCount(0);
	});

	test("renders items in order with first/last, and hides empty", async ({ page }) => {
		await page.getByTestId("add-last").click();
		await page.getByTestId("add-last").click();
		await page.getByTestId("add-last").click();

		await expect(items(page)).toHaveText(["Item 1", "Item 2", "Item 3"]);
		await expect(empty(page)).toHaveCount(0);
		await expect(first(page)).toHaveCount(1);
		await expect(last(page)).toHaveCount(1);
	});

	test("add first / add last reconcile ordering", async ({ page }) => {
		await page.getByTestId("add-last").click();  // [1]
		await page.getByTestId("add-last").click();  // [1,2]
		await page.getByTestId("add-first").click(); // [3,1,2]
		await expect(items(page)).toHaveText(["Item 3", "Item 1", "Item 2"]);
	});

	test("remove first / remove last reconcile", async ({ page }) => {
		await page.getByTestId("add-last").click(); // [1]
		await page.getByTestId("add-last").click(); // [1,2]
		await page.getByTestId("add-last").click(); // [1,2,3]

		await page.getByTestId("remove-first").click(); // [2,3]
		await expect(items(page)).toHaveText(["Item 2", "Item 3"]);

		await page.getByTestId("remove-last").click(); // [2]
		await expect(items(page)).toHaveText(["Item 2"]);
	});

	test("reorder (move first to last) reflects in the DOM", async ({ page }) => {
		await page.getByTestId("add-last").click(); // [1]
		await page.getByTestId("add-last").click(); // [1,2]
		await page.getByTestId("add-last").click(); // [1,2,3]

		await page.getByTestId("move").click(); // [2,3,1]
		await expect(items(page)).toHaveText(["Item 2", "Item 3", "Item 1"]);
	});

	test("alt slot is used for items whose c-test is truthy", async ({ page }) => {
		await page.getByTestId("add-last").click();    // Item 1 (normal)
		await page.getByTestId("add-special").click(); // Item 2 (special)

		// item slot renders the plain label; alt slot prefixes "ALT".
		await expect(items(page)).toHaveText(["Item 1", "ALT Item 2"]);
		await expect(page.getByTestId("each-item").nth(0)).toHaveAttribute("data-kind", "item");
		await expect(page.getByTestId("each-item").nth(1)).toHaveAttribute("data-kind", "alt");
	});

	test("alt/item is chosen at creation, not re-evaluated on in-place mutation (intended)", async ({ page }) => {
		// Intended behavior: the alt-vs-item slot is decided when the item component is
		// created. Because c-each reconciles by key (v().id here), toggling c-test on an
		// EXISTING item reuses the same component and does NOT re-slot it. Re-slotting only
		// happens when the item is (re)created — e.g. under a new id.
		await page.getByTestId("add-last").click(); // Item 1 (normal, id stable)
		await expect(items(page)).toHaveText(["Item 1"]);
		await expect(items(page).first()).toHaveAttribute("data-kind", "item");

		// Toggle its c-test field in place -> slot is unchanged (still the item slot).
		await page.getByTestId("toggle-special").click();
		await expect(items(page)).toHaveText(["Item 1"]);
		await expect(items(page).first()).toHaveAttribute("data-kind", "item");
	});

	test("clear empties the list and restores the empty slot", async ({ page }) => {
		await page.getByTestId("add-last").click();
		await page.getByTestId("add-last").click();
		await expect(items(page)).toHaveCount(2);

		await page.getByTestId("clear").click();
		await expect(items(page)).toHaveCount(0);
		await expect(empty(page)).toHaveCount(1);
	});
});
