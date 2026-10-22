import { Page, test } from "@playwright/test";

// Shared helpers for the GC regression guards. Forcing a real garbage collection is only possible
// through the Chrome DevTools Protocol, so these tests run under Chromium only.

/** Call at the top of a GC test body; skips on non-Chromium projects (CDP is Chromium-only). */
export function skipUnlessChromium(browserName: string): void {
	test.skip(browserName !== "chromium", "forced GC via CDP HeapProfiler.collectGarbage is Chromium-only");
}

/**
 * Returns a `collect()` function that forces a full garbage collection in the page. Use it between
 * interactions to prove a binding/callback survives GC (i.e. is retained by whoever needs it) rather
 * than being silently reaped from a WeakRef-based registry.
 */
export async function makeGc(page: Page): Promise<() => Promise<void>> {
	const client = await page.context().newCDPSession(page);

	return async () => {
		await client.send("HeapProfiler.collectGarbage");
	};
}
