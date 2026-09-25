import { test, expect, Page, Locator } from "@playwright/test";

/**
 * `v()` inside `c-each` items via the "Each Item Values" specimen. Each scenario runs against a
 * `generated`-mode list and an `expression`-mode list over equivalent data. Model mirrors
 * (`gen-model` / `expr-model`) show the parent's array as `name|qty|color|done,...` so a test can
 * tell whether the DOM or the model is wrong.
 */

const MODES: { mode: string; model: string }[] = [
	{ mode: "generated", model: "gen-model" },
	{ mode: "expression", model: "expr-model" }
];

const INITIAL: string = "alpha|1|red|false,beta|2|green|true,gamma|3|blue|false";

for (const { mode, model } of MODES) {
	test.describe(`c-each v() — ${ mode } mode`, () => {
		let page: Page;

		const row = (index: number): Locator => page.getByTestId(`list-${ mode }`).getByTestId("row").nth(index);
		const rows = (): Locator => page.getByTestId(`list-${ mode }`).getByTestId("row");
		const modelText = (): Locator => page.getByTestId(model);

		async function expectRow(index: number, name: string, qty: number, color: string, done: boolean): Promise<void> {
			const r: Locator = row(index);
			await expect(r.getByTestId("name")).toHaveText(name);
			await expect(r.getByTestId("qty")).toHaveText(String(qty));
			await expect(r.getByTestId("color")).toHaveText(color);
			await expect(r).toHaveAttribute("title", name);
			await expect(r.getByTestId("name-input")).toHaveValue(name);
			await expect(r.getByTestId("qty-input")).toHaveValue(String(qty));
			await expect(r.getByTestId("color-input")).toHaveValue(color);

			if (done) {
				await expect(r).toHaveClass(/is-done/);
				await expect(r.getByTestId("if-done")).toHaveCount(1);
				await expect(r.getByTestId("hidden-when-not-done")).toBeVisible();
				await expect(r.getByTestId("done-input")).toBeChecked();
			} else {
				await expect(r).not.toHaveClass(/is-done/);
				await expect(r.getByTestId("if-done")).toHaveCount(0);
				await expect(r.getByTestId("hidden-when-not-done")).toBeHidden();
				await expect(r.getByTestId("done-input")).not.toBeChecked();
			}
		}

		test.beforeEach(async ({ page: p }) => {
			page = p;
			await page.goto("/");
			await page.getByRole("link", { name: "Specimens" }).click();
			await page.getByRole("link", { name: "Each Item Values" }).click();
			await expect(modelText()).toHaveText(INITIAL);
		});

		test("initial render surfaces each item in every binding context", async () => {
			await expect(rows()).toHaveCount(3);
			await expectRow(0, "alpha", 1, "red", false);
			await expectRow(1, "beta", 2, "green", true);
			await expectRow(2, "gamma", 3, "blue", false);
		});

		test("invoked expression receives the item (c-onclick with v())", async () => {
			await row(1).getByTestId("select").click();
			await expect(page.getByTestId("selected")).toHaveText("beta");
		});

		test("in-place edit of an item is reflected", async () => {
			await page.getByTestId("edit-in-place").click();
			await expect(modelText()).toHaveText("alpha*|1|red|true,beta|2|green|true,gamma|3|blue|false");
			await expectRow(0, "alpha*", 1, "red", true);
		});

		test("replacing every item with a same-key copy is reflected", async () => {
			await page.getByTestId("replace-all").click();
			await expect(modelText()).toHaveText("alpha+|1|red|false,beta+|2|green|true,gamma+|3|blue|false");
			await expectRow(0, "alpha+", 1, "red", false);
			await expectRow(1, "beta+", 2, "green", true);
			await expectRow(2, "gamma+", 3, "blue", false);
		});

		test("replacing one item with a same-key copy is reflected", async () => {
			await page.getByTestId("replace-first").click();
			await expect(modelText()).toHaveText("alpha#|1|red|true,beta|2|green|true,gamma|3|blue|false");
			await expectRow(0, "alpha#", 1, "red", true);
		});

		test("reorder keeps each item's own values", async () => {
			await page.getByTestId("reverse").click();
			await expectRow(0, "gamma", 3, "blue", false);
			await expectRow(1, "beta", 2, "green", true);
			await expectRow(2, "alpha", 1, "red", false);
		});

		test("add and remove keep remaining items correct", async () => {
			await page.getByTestId("add").click();
			await expect(rows()).toHaveCount(4);
			await expectRow(3, "row4", 4, "red", false);
			await page.getByTestId("remove-first").click();
			await expect(rows()).toHaveCount(3);
			await expectRow(0, "beta", 2, "green", true);
			await expectRow(2, "row4", 4, "red", false);
		});

		test("c-model and c-checked on v() write through to the parent's item", async () => {
			const r: Locator = row(0);
			await r.getByTestId("name-input").fill("typed");
			await r.getByTestId("qty-input").fill("7");
			await r.getByTestId("color-input").selectOption("blue");
			await r.getByTestId("done-input").check();
			await expect(modelText()).toHaveText("typed|7|blue|true,beta|2|green|true,gamma|3|blue|false");
			await expectRow(0, "typed", 7, "blue", true);
		});

		test("after a same-key replacement, typing writes to the new item", async () => {
			await page.getByTestId("replace-all").click();
			await expect(modelText()).toHaveText("alpha+|1|red|false,beta+|2|green|true,gamma+|3|blue|false");
			await row(0).getByTestId("name-input").fill("fresh");
			await expect(modelText()).toHaveText("fresh|1|red|false,beta+|2|green|true,gamma+|3|blue|false");
			await expect(row(0).getByTestId("name")).toHaveText("fresh");
		});
	});
}
