import { test, expect, Page } from "@playwright/test";

/**
 * Proves `SeriesBehavior` (`<c-series>`): components are added, removed, reordered,
 * replaced, and cleared via `$c().forSeries(name)`. Assertions cover both the count and
 * the DOM order/labels of the rendered item components.
 */
test.describe("SeriesBehavior", () => {
	const items = (page: Page) => page.getByTestId("series-item");
	const count = (page: Page) => page.getByTestId("count");

	test.beforeEach(async ({ page }: { page: Page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Series Behavior" }).click();
	});

	test("adds, removes, reorders, replaces, and clears components", async ({ page }) => {
		// Empty to start.
		await expect(count(page)).toHaveText("0");
		await expect(items(page)).toHaveCount(0);

		// insertLast x3 -> [1, 2, 3]
		await page.getByTestId("add-last").click();
		await page.getByTestId("add-last").click();
		await page.getByTestId("add-last").click();
		await expect(count(page)).toHaveText("3");
		await expect(items(page)).toHaveText(["Item 1", "Item 2", "Item 3"]);

		// insertFirst -> [4, 1, 2, 3]
		await page.getByTestId("add-first").click();
		await expect(count(page)).toHaveText("4");
		await expect(items(page)).toHaveText(["Item 4", "Item 1", "Item 2", "Item 3"]);

		// removeFirst -> [1, 2, 3]
		await page.getByTestId("remove-first").click();
		await expect(count(page)).toHaveText("3");
		await expect(items(page)).toHaveText(["Item 1", "Item 2", "Item 3"]);

		// removeLast -> [1, 2]
		await page.getByTestId("remove-last").click();
		await expect(count(page)).toHaveText("2");
		await expect(items(page)).toHaveText(["Item 1", "Item 2"]);

		// insertBefore(1) -> [1, 5, 2]
		await page.getByTestId("insert-second").click();
		await expect(count(page)).toHaveText("3");
		await expect(items(page)).toHaveText(["Item 1", "Item 5", "Item 2"]);

		// replaceAt(0) -> [6, 5, 2] (count unchanged)
		await page.getByTestId("replace-first").click();
		await expect(count(page)).toHaveText("3");
		await expect(items(page)).toHaveText(["Item 6", "Item 5", "Item 2"]);

		// clear -> []
		await page.getByTestId("clear").click();
		await expect(count(page)).toHaveText("0");
		await expect(items(page)).toHaveCount(0);
	});
});
