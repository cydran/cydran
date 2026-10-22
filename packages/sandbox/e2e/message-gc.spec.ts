import { test, expect } from "@playwright/test";
import { makeGc, skipUnlessChromium } from "./support/gc";

// Regression guard: the idiomatic, documented way to register a message handler is a METHOD REFERENCE
// (not an inline closure). A prototype method is strongly reachable via the class, so the subscription
// survives GC. This locks in that the recommended usage stays GC-safe.
//
// The unsafe counterpart — an inline closure passed to onMessage(...).invoke(...) — is held only
// weakly and may be collected by design; that footgun is demonstrated live by the
// MessageClosureGcSpecimen and documented in the memory-model notes, not asserted here (it would be a
// non-deterministic negative).
test.describe("message handler (method ref) survives GC", () => {
	test("onMessage method-ref keeps receiving after forced GC", async ({ page, browserName }) => {
		skipUnlessChromium(browserName);
		const gc = await makeGc(page);

		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Message Closure GC" }).click();

		const sent = page.getByTestId("sent");
		const viaMethod = page.getByTestId("via-method");
		const sendPing = page.getByTestId("send-ping");

		// Pre-GC: the method-ref subscription receives.
		await sendPing.click();
		await expect(sent).toHaveText("1");
		await expect(viaMethod).toHaveText("got=1");

		// The guard: after forced GC, the method-ref subscription must still receive.
		await gc();
		await sendPing.click();
		await expect(sent).toHaveText("2");
		await expect(viaMethod, "method-ref subscription stopped receiving after GC").toHaveText("got=2");

		await gc();
		await sendPing.click();
		await expect(viaMethod, "method-ref subscription stopped receiving after 2nd GC").toHaveText("got=3");
	});
});
