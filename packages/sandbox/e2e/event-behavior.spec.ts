import { test, expect, Page } from "@playwright/test";

/**
 * Proves each `c-on<event>` behavior binds the corresponding DOM event and invokes its
 * expression with the native event as `p().$event`. Each element records its
 * `$event.type` into a per-event mirror; each test triggers one event and asserts the
 * matching mirror. `keydown` additionally asserts `$event.key`.
 */
test.describe("c-on* event behaviors", () => {
	test.beforeEach(async ({ page }: { page: Page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Event Behavior" }).click();
	});

	const fired = (page: Page, name: string) => page.getByTestId(`fired-${name}`);

	test("click", async ({ page }) => {
		await page.getByTestId("evt-click").click();
		await expect(fired(page, "click")).toHaveText("click");
	});

	test("dblclick", async ({ page }) => {
		await page.getByTestId("evt-dblclick").dblclick();
		await expect(fired(page, "dblclick")).toHaveText("dblclick");
	});

	test("contextmenu", async ({ page }) => {
		await page.getByTestId("evt-contextmenu").click({ button: "right" });
		await expect(fired(page, "contextmenu")).toHaveText("contextmenu");
	});

	test("mousedown", async ({ page }) => {
		await page.getByTestId("evt-mousedown").click();
		await expect(fired(page, "mousedown")).toHaveText("mousedown");
	});

	test("mouseup", async ({ page }) => {
		await page.getByTestId("evt-mouseup").click();
		await expect(fired(page, "mouseup")).toHaveText("mouseup");
	});

	test("mouseenter", async ({ page }) => {
		await page.getByTestId("evt-mouseenter").hover();
		await expect(fired(page, "mouseenter")).toHaveText("mouseenter");
	});

	test("mouseover", async ({ page }) => {
		await page.getByTestId("evt-mouseover").hover();
		await expect(fired(page, "mouseover")).toHaveText("mouseover");
	});

	test("mousemove", async ({ page }) => {
		await page.getByTestId("evt-mousemove").hover();
		await expect(fired(page, "mousemove")).toHaveText("mousemove");
	});

	test("mouseleave", async ({ page }) => {
		await page.getByTestId("evt-mouseleave").hover();
		await page.getByTestId("neutral").hover(); // move away to fire mouseleave
		await expect(fired(page, "mouseleave")).toHaveText("mouseleave");
	});

	test("mouseout", async ({ page }) => {
		await page.getByTestId("evt-mouseout").hover();
		await page.getByTestId("neutral").hover(); // move away to fire mouseout
		await expect(fired(page, "mouseout")).toHaveText("mouseout");
	});

	test("wheel", async ({ page }) => {
		await page.getByTestId("evt-wheel").hover();
		await page.mouse.wheel(0, 120);
		await expect(fired(page, "wheel")).toHaveText("wheel");
	});

	test("keydown (with $event.key)", async ({ page }) => {
		await page.getByTestId("evt-keydown").press("a");
		await expect(fired(page, "keydown")).toHaveText("keydown");
		await expect(page.getByTestId("last-key")).toHaveText("a");
	});

	test("keyup", async ({ page }) => {
		await page.getByTestId("evt-keyup").press("b");
		await expect(fired(page, "keyup")).toHaveText("keyup");
	});

	test("input", async ({ page }) => {
		await page.getByTestId("evt-input").fill("x");
		await expect(fired(page, "input")).toHaveText("input");
	});

	test("change", async ({ page }) => {
		await page.getByTestId("evt-change").check();
		await expect(fired(page, "change")).toHaveText("change");
	});

	test("focus", async ({ page }) => {
		await page.getByTestId("evt-focus").focus();
		await expect(fired(page, "focus")).toHaveText("focus");
	});

	test("blur", async ({ page }) => {
		await page.getByTestId("evt-blur").focus();
		await page.getByTestId("evt-blur").blur();
		await expect(fired(page, "blur")).toHaveText("blur");
	});

	test("focusin", async ({ page }) => {
		await page.getByTestId("evt-focusin").focus();
		await expect(fired(page, "focusin")).toHaveText("focusin");
	});

	test("focusout", async ({ page }) => {
		await page.getByTestId("evt-focusout").focus();
		await page.getByTestId("evt-focusout").blur();
		await expect(fired(page, "focusout")).toHaveText("focusout");
	});

	test("submit", async ({ page }) => {
		await page.getByTestId("evt-submit").click();
		await expect(fired(page, "submit")).toHaveText("submit");
	});
});
