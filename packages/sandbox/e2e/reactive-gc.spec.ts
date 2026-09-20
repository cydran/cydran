import { test, expect } from "@playwright/test";

// Regression guard: reactive bindings must keep working after garbage collection.
// Forces a full GC between changes (CDP HeapProfiler.collectGarbage). Before the fix, the input
// behavior's inline DOM-event handler closure — held only via WeakRef in the message registry — was
// collected while still mounted, so `input`/`change` events invoked 0 handlers, the model stopped
// updating, and the display froze at the pre-GC value. Fixed by having each behavior retain its own
// handler closures on the instance (AbstractInputModelBehavior/CheckedBehavior/MultiSelect/Focus).
//
// CDP is Chromium-only, so this test runs only under Chromium.
test.describe("reactive binding survives GC", () => {
	test("radio model display keeps tracking after forced GC", async ({ page, browserName }) => {
		test.skip(browserName !== "chromium", "forced GC via CDP HeapProfiler.collectGarbage is Chromium-only");

		const client = await page.context().newCDPSession(page);

		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (radio)" }).click();

		const output = page.getByTestId("model-output");
		const byValue: Record<string, ReturnType<typeof page.getByTestId>> = {
			small: page.getByTestId("radio-small"),
			medium: page.getByTestId("radio-medium"),
			large: page.getByTestId("radio-large"),
		};

		await expect(output).toHaveText("medium");

		const sequence = ["small", "large", "medium", "small", "large"];
		for (const value of sequence) {
			await byValue[value].check();
			await client.send("HeapProfiler.collectGarbage");
			await expect(output, `after GC, clicking ${value}`).toHaveText(value);
		}
	});
});
