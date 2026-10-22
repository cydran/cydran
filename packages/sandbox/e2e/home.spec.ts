import { test, expect } from "@playwright/test";

test.describe("sandbox smoke test", () => {
	test("is reachable and renders the Cydran brand on the first page", async ({ page }) => {
		// Reachability: the dev server must serve the SPA shell with a 2xx response.
		const response = await page.goto("/");
		expect(response, "no response received from the sandbox dev server").not.toBeNull();
		expect(response!.ok(), `unexpected HTTP status ${response!.status()}`).toBeTruthy();

		// Content: Cydran renders the DOM client-side, so the served HTML body is
		// empty until the framework boots. The navbar brand (Menu component label)
		// renders the word "Cydran"; wait for it to appear and be visible.
		await expect(page.getByText("Cydran").first()).toBeVisible();
	});
});
