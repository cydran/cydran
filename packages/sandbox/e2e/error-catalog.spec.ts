import { test, expect, Page } from "@playwright/test";

/**
 * Empirically verifies the developer-facing error catalog: each trigger throws a specific
 * Cydran error class with a specific message. Ground truth for `error-catalog.md`.
 */
const EXPECTED: Array<{ key: string; name: string; message: string }> = [
	{ key: "templateMultiNode", name: "TemplateError", message: "1 (one) required top level node permitted" },
	{ key: "templateScript", name: "TemplateError", message: "must not use a script tag as top-level element" },
	{ key: "unknownRegion", name: "UnknownRegionError", message: "is unknown and must be declared in component template" },
	{ key: "lockedRegion", name: "LockedRegionError", message: "is locked and can not be updated" },
	{ key: "unknownForm", name: "UnknownElementError", message: "Unknown form: noSuchForm" },
	{ key: "unknownElement", name: "UnknownElementError", message: "Unknown element: noSuchElement" },
	{ key: "unknownSeries", name: "UnknownElementError", message: "Unknown series: noSuchSeries" },
	{ key: "bounds", name: "BoundsError", message: "out of bounds for series" },
	{ key: "duplicate", name: "DuplicateComponentError", message: "Component already exists in series" },
	{ key: "namingConflict", name: "NamingConflictError", message: "Child context name already exists" },
	{ key: "unknownContext", name: "UnknownContextError", message: "Unknown child context: noSuchChildContext" },
	{ key: "unknownProperty", name: "UnknownPropertyError", message: "Unknown property: no.such.property" },
	{ key: "prefixMismatch", name: "PrefixMismatchError", message: "preferredKey must start with the prefix" },
	{ key: "invalidStateBuilder", name: "InvalidStateError", message: "Already built" },
	{ key: "validationPrefix", name: "ValidationError", message: "Prefix values must only contain letters and single dashes" },
];

test.describe("Error catalog (empirical)", () => {
	test("each trigger throws its documented error class + message", async ({ page }: { page: Page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "Specimens" }).click();
		await page.getByRole("link", { name: "Error Catalog" }).click();

		for (const { key, name, message } of EXPECTED) {
			await page.getByTestId(`btn-${key}`).click();
			const result = page.getByTestId(`res-${key}`);
			await expect(result, `${key} error class`).toContainText(name);
			await expect(result, `${key} error message`).toContainText(message);
		}
	});
});
