import { test, expect } from "@playwright/test";
import { makeGc, skipUnlessChromium } from "./support/gc";

// Regression guard: a reactive `createFilter` recomputes via an internal watcher whose callback is
// registered as an inline closure held only weakly. This test forces GC between mutations to prove the
// filter keeps recomputing rather than freezing at its cached result.
//
// Note: the filter is lazy — `items()` is empty until the first source change, then tracks the list.
//
// Guards the fix in FilterImpl: it registers its recompute callback with the digest Watcher (which
// holds it only weakly), so FilterImpl retains that closure on the instance. Without the fix a forced
// GC collects it and the filter freezes at its cached result (after GC, adding an item leaves
// `filtered` at "3" instead of "4").
test.describe("filtered list survives GC", () => {
	test("createFilter keeps recomputing after forced GC", async ({ page, browserName }) => {
		skipUnlessChromium(browserName);
		const gc = await makeGc(page);

		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Filter GC" }).click();

		const count = page.getByTestId("filtered-count");
		const addItem = page.getByTestId("add-item");

		// Prime the filter and confirm it recomputes pre-GC (0 -> tracks the source).
		await addItem.click();
		await expect(count).toHaveText("3");

		// The probe: after a forced GC, further mutations must still recompute the filter.
		await gc();
		await addItem.click();
		await expect(count, "filter stopped recomputing after GC").toHaveText("4");

		await gc();
		await addItem.click();
		await expect(count, "filter stopped recomputing after 2nd GC").toHaveText("5");
	});
});
