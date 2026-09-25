import { test, expect, Page } from "@playwright/test";

/**
 * Proves `FormBehavior`: a form reset (native button or `$c().forForm().reset()`)
 * broadcasts to controls so `c-model`/`c-checked` revert to defaults AND update the
 * model; and `$c().forForm().requestSubmit()` / a native submit fire the submit handler.
 */
test.describe("FormBehavior", () => {
	test.beforeEach(async ({ page }: { page: Page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Form Behavior" }).click();
	});

	test("native reset reverts controls and updates the model", async ({ page }) => {
		const nameInput = page.getByTestId("name-input");
		const agreeInput = page.getByTestId("agree-input");
		const nameState = page.getByTestId("name-state");
		const agreeState = page.getByTestId("agree-state");

		// Initial defaults.
		await expect(nameInput).toHaveValue("default name");
		await expect(nameState).toHaveText("default name");
		await expect(agreeInput).not.toBeChecked();
		await expect(agreeState).toHaveText("false");

		// Change both controls (updates the model).
		await nameInput.fill("changed");
		await agreeInput.check();
		await expect(nameState).toHaveText("changed");
		await expect(agreeState).toHaveText("true");

		// Native reset -> controls revert AND the model updates via the reset broadcast.
		await page.getByTestId("native-reset").click();
		await expect(nameInput).toHaveValue("default name");
		await expect(nameState).toHaveText("default name");
		await expect(agreeInput).not.toBeChecked();
		await expect(agreeState).toHaveText("false");
	});

	test("forForm(name).reset() resets the form and model", async ({ page }) => {
		const nameInput = page.getByTestId("name-input");
		const agreeInput = page.getByTestId("agree-input");
		const nameState = page.getByTestId("name-state");
		const agreeState = page.getByTestId("agree-state");

		await nameInput.fill("changed");
		await agreeInput.check();
		await expect(nameState).toHaveText("changed");
		await expect(agreeState).toHaveText("true");

		// Programmatic reset via the FormOperations API.
		await page.getByTestId("api-reset").click();
		await expect(nameInput).toHaveValue("default name");
		await expect(nameState).toHaveText("default name");
		await expect(agreeInput).not.toBeChecked();
		await expect(agreeState).toHaveText("false");
	});

	test("forForm(name).requestSubmit() fires the submit handler", async ({ page }) => {
		const submittedState = page.getByTestId("submitted-state");

		await expect(submittedState).toHaveText("false");
		await page.getByTestId("api-submit").click();
		await expect(submittedState).toHaveText("true");
	});

	test("native submit fires the submit handler", async ({ page }) => {
		const submittedState = page.getByTestId("submitted-state");

		await expect(submittedState).toHaveText("false");
		await page.getByTestId("native-submit").click();
		await expect(submittedState).toHaveText("true");
	});
});
