import { test, expect } from "@playwright/test";

/**
 * Proves two-way `c-model` across text-like input types (email, password, search, tel,
 * url), all of which use the STRING accessor strategy (`el.value`). The binding path is
 * identical per type, so the test parametrizes over them.
 */
const CASES = [
	{ type: "email", initial: "user@example.com", typed: "a@b.co" },
	{ type: "password", initial: "s3cret", typed: "hunter2" },
	{ type: "search", initial: "cydran", typed: "mvvm" },
	{ type: "tel", initial: "555-0100", typed: "555-0199" },
	{ type: "url", initial: "https://cydran.org", typed: "https://example.com" },
];

test.describe("c-model across text-like input types", () => {
	test("two-way binds each text-like input to its string model field", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Input Model Behavior (text types)" }).click();

		for (const { type, initial, typed } of CASES) {
			const input = page.getByTestId(`input-${type}`);
			const output = page.getByTestId(`out-${type}`);

			// Model -> DOM: initial value seeds the input and the mirror.
			await expect(input, `${type} initial input value`).toHaveValue(initial);
			await expect(output, `${type} initial model mirror`).toHaveText(initial);

			// DOM -> Model: typing updates the string model field.
			await input.fill(typed);
			await expect(output, `${type} model after typing`).toHaveText(typed);
		}
	});
});
