import { test, expect } from "@playwright/test";

// Regression guard for cydran/cydran#832: reactive {{ }} bindings must keep updating after GC.
// Forces a full garbage collection between changes (CDP HeapProfiler.collectGarbage). Without the
// fix, the mediator watch callback (held via WeakRef) is collected and the model display freezes.
//
// SKIPPED — tracked in cydran/cydran#832. This deterministically FAILS on current code (3/3 runs:
// the display freezes at the pre-GC value). Re-enable (remove `.skip`) as part of the #832 fix —
// restoring this test is explicit acceptance criteria for that issue.
test.describe("#832 reactive binding survives GC", () => {
	test.skip("radio model display keeps tracking after forced GC", async ({ page }) => {
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
