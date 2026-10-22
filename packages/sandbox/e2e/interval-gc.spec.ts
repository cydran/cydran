import { test, expect } from "@playwright/test";
import { makeGc, skipUnlessChromium } from "./support/gc";

// Regression guard: an interval registered with a METHOD REFERENCE keeps ticking after GC. IntervalImpl
// holds both its thisObject and callback via WeakRef, so a method reference (strongly reachable via the
// class) is the safe way to keep an interval alive. An inline-closure interval would be collectable —
// that footgun is demonstrated by the IntervalGcSpecimen and documented in the memory-model notes.
test.describe("interval (method ref) survives GC", () => {
	test("onInterval method-ref keeps ticking after forced GC", async ({ page, browserName }) => {
		skipUnlessChromium(browserName);
		const gc = await makeGc(page);

		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Interval GC" }).click();

		const ticks = page.getByTestId("ticks");
		const readTicks = async (): Promise<number> => Number((await ticks.textContent()) ?? "0");

		// The interval is running.
		await expect.poll(readTicks).toBeGreaterThan(0);
		const before: number = await readTicks();

		// The guard: after forced GC, the interval must keep ticking.
		await gc();
		await expect.poll(readTicks, { timeout: 5000, message: "interval stopped ticking after GC" }).toBeGreaterThan(before);
	});
});
