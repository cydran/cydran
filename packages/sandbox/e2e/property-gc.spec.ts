import { test, expect } from "@playwright/test";
import { makeGc, skipUnlessChromium } from "./support/gc";

// Regression guard: a property observer registered with a METHOD REFERENCE keeps firing after GC.
// Property observers are held weakly (ObservableImpl), so a method reference (strongly reachable via
// the class) is the safe way to keep the observer alive. An inline-closure observer would be
// collectable — that footgun is documented in the memory-model notes.
test.describe("property observer (method ref) survives GC", () => {
	test("addPropertyObserver method-ref keeps firing after forced GC", async ({ page, browserName }) => {
		skipUnlessChromium(browserName);
		const gc = await makeGc(page);

		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Property Observer GC" }).click();

		const observed = page.getByTestId("observed");
		const bump = page.getByTestId("bump");

		// Pre-GC: the observer fires on a property change.
		await bump.click();
		await expect(observed).toHaveText("got=1");

		// The guard: after forced GC, the observer must still fire.
		await gc();
		await bump.click();
		await expect(observed, "property observer stopped firing after GC").toHaveText("got=2");

		await gc();
		await bump.click();
		await expect(observed, "property observer stopped firing after 2nd GC").toHaveText("got=3");
	});
});
