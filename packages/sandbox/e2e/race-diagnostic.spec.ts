import { test, expect } from "@playwright/test";
import { makeGc, skipUnlessChromium } from "./support/gc";

/**
 * Regression guard for cydran/cydran#825: c-model must propagate an input event that a sibling
 * c-oninput on the same element demonstrably receives. Run under load to exercise the race:
 *   npx playwright test --project=chromium --repeat-each=200 --fully-parallel --retries=0 e2e/race-diagnostic.spec.ts
 */
test.describe("Race diagnostic (#825)", () => {
	test("c-model propagates an input the sibling c-oninput sees", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Race Diagnostic" }).click();

		const input = page.getByTestId("race-input");
		const value = page.getByTestId("race-value");
		const bumps = page.getByTestId("race-bumps");

		await input.fill("hello");

		await expect(bumps).not.toHaveText("0");
		await expect(value).toHaveText("hello");
	});

	// Deterministic variant: forcing GC between mount and the first input reproduces the drop on
	// code where ValuedModelBehavior's input handler was an unretained inline closure (#832 class).
	test("c-model propagates an input after a forced GC", async ({ page, browserName }) => {
		skipUnlessChromium(browserName);
		const gc = await makeGc(page);

		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Race Diagnostic" }).click();

		const input = page.getByTestId("race-input");
		const value = page.getByTestId("race-value");
		const bumps = page.getByTestId("race-bumps");
		await expect(value).toHaveText("initial");

		await gc();
		await gc();

		await input.fill("hello");

		await expect(bumps).not.toHaveText("0");
		await expect(value).toHaveText("hello");
	});
});
