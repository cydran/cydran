import { isDefined, requireNotNull } from "../Utils.js";

function isPlainObject(value: unknown): boolean {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Overlays the properties a package's section sets onto a copy of the default section. A property that is null or
 * undefined keeps its default; any other value replaces the default value whole.
 */
function overlaySection(defaultSection: any, packageSection: any): any {
	const merged: any = { ...defaultSection };

	for (const name in packageSection) {
		if (Object.prototype.hasOwnProperty.call(packageSection, name) && isDefined(packageSection[name])) {
			merged[name] = packageSection[name];
		}
	}

	return merged;
}

/**
 * Combines the default configuration with a package's cydran-build object. Sections that are objects in both are
 * merged property by property; any other section the package sets replaces the default whole; sections the package
 * does not set, or sets to null, keep their defaults. The defaults are copied and never modified.
 */
function mergeConfig(defaults: any, packageConfig: any): any {
	requireNotNull(defaults, "defaults");

	const merged: any = structuredClone(defaults);

	for (const name in packageConfig) {
		const packageSection: any = Object.prototype.hasOwnProperty.call(packageConfig, name) ? packageConfig[name] : undefined;

		if (!isDefined(packageSection)) {
			// Keeps the default section
		} else if (isPlainObject(packageSection) && isPlainObject(merged[name])) {
			merged[name] = overlaySection(merged[name], packageSection);
		} else {
			merged[name] = packageSection;
		}
	}

	return merged;
}

export { mergeConfig };
