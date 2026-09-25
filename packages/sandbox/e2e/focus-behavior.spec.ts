import { test, expect, Page } from "@playwright/test";
import { makeGc, skipUnlessChromium } from "./support/gc";

/**
 * Proves `c-focus`: focuses its element when the expression becomes truthy, FORCES focus
 * retention while truthy (immediately re-focuses on focusout), and releases when falsy.
 *
 * The retention tests guard against the focus trap silently stopping: the focusout handler
 * must stay registered, including across garbage collection (the forced-GC variant fails
 * every time if the handler is only weakly held).
 */
test.describe("c-focus behavior", () => {
	test.beforeEach(async ({ page }: { page: Page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Focus Behavior" }).click();
	});

	test("focuses its element when the expression becomes truthy", async ({ page }) => {
		const target = page.getByTestId("target");
		const state = page.getByTestId("state");

		await expect(state).toHaveText("false");
		await expect(target).not.toBeFocused();

		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("true");
		await expect(target).toBeFocused();
	});

	test("forces focus retention: re-focuses immediately when focus leaves", async ({ page }) => {
		const target = page.getByTestId("target");
		const other = page.getByTestId("other");

		// Activate the trap.
		await page.getByTestId("toggle").click();
		await expect(target).toBeFocused();

		// Attempt to move focus to another field -> the behavior yanks it back.
		await other.click();
		await expect(target).toBeFocused();
		await expect(other).not.toBeFocused();
	});

	// Forced GC between activating the trap and moving focus away (Chromium only, via CDP).
	test("forces focus retention after a forced GC", async ({ page, browserName }) => {
		skipUnlessChromium(browserName);
		const gc = await makeGc(page);
		const target = page.getByTestId("target");
		const other = page.getByTestId("other");

		await page.getByTestId("toggle").click();
		await expect(target).toBeFocused();

		await gc();
		await gc();

		await other.click();
		await expect(target).toBeFocused();
		await expect(other).not.toBeFocused();
	});

	test("releases focus once the expression is falsy", async ({ page }) => {
		const target = page.getByTestId("target");
		const other = page.getByTestId("other");
		const state = page.getByTestId("state");

		await page.getByTestId("toggle").click();
		await expect(target).toBeFocused();

		// Turn the trap off; focus can now move away and stay away.
		await page.getByTestId("toggle").click();
		await expect(state).toHaveText("false");
		await other.click();
		await expect(other).toBeFocused();
		await expect(target).not.toBeFocused();
	});
});
