import { test, expect } from "@playwright/test";
import { makeGc, skipUnlessChromium } from "./support/gc";

// Regression guard: the idiomatic, documented way to register a reactive watch is a METHOD REFERENCE
// (not an inline closure). A prototype method is strongly reachable via the class, so the subscription
// survives GC. This locks in that the recommended usage stays GC-safe.
//
// The unsafe counterpart — an inline closure passed to onExpressionValueChange — is held only weakly
// and may be collected by design; that footgun is demonstrated live by the WatchClosureGcSpecimen and
// documented in the memory-model notes, not asserted here (it would be a non-deterministic negative).
test.describe("watch(method ref) survives GC", () => {
	test("onExpressionValueChange method-ref keeps firing after forced GC", async ({ page, browserName }) => {
		skipUnlessChromium(browserName);
		const gc = await makeGc(page);

		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Watch Closure GC" }).click();

		const count = page.getByTestId("count");
		const mirror = page.getByTestId("mirror-method");
		const increment = page.getByTestId("increment");

		// Pre-GC: the method-ref watch fires.
		await increment.click();
		await expect(count).toHaveText("1");
		await expect(mirror).toHaveText("seen=1");

		// The guard: after forced GC, the method-ref watch must still fire.
		await gc();
		await increment.click();
		await expect(count).toHaveText("2");
		await expect(mirror, "method-ref watch stopped firing after GC").toHaveText("seen=2");

		await gc();
		await increment.click();
		await expect(mirror, "method-ref watch stopped firing after 2nd GC").toHaveText("seen=3");
	});
});
