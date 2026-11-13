const SECTION_NAME: string = "unit-tests";

interface UnitTestsConfig {

	active: boolean;

	include: string[];

	exclude: string[];

	failOnMissing: boolean;

	failOnOrphaned: boolean;

}

function isStringArray(value: unknown): boolean {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isActive(raw: any): boolean {
	const active: unknown = (raw === null || raw === undefined) ? false : raw["active"];

	if (typeof active !== "boolean") {
		throw new Error(`${SECTION_NAME}.active must be a boolean`);
	}

	return active;
}

function readUnitTestsConfig(raw: any): UnitTestsConfig {
	const active: boolean = isActive(raw);

	if (!isStringArray(raw["include"])) {
		throw new Error(`${SECTION_NAME}.include must be an array of strings`);
	}

	if (!isStringArray(raw["exclude"])) {
		throw new Error(`${SECTION_NAME}.exclude must be an array of strings`);
	}

	if (typeof raw["failOnMissing"] !== "boolean") {
		throw new Error(`${SECTION_NAME}.failOnMissing must be a boolean`);
	}

	if (typeof raw["failOnOrphaned"] !== "boolean") {
		throw new Error(`${SECTION_NAME}.failOnOrphaned must be a boolean`);
	}

	return {
		active: active,
		include: raw["include"],
		exclude: raw["exclude"],
		failOnMissing: raw["failOnMissing"],
		failOnOrphaned: raw["failOnOrphaned"]
	};
}

const INACTIVE_NOTICE: string = `Unit-test check inactive (${SECTION_NAME}.active is false); skipping`;

export { UnitTestsConfig, SECTION_NAME, INACTIVE_NOTICE, isActive, readUnitTestsConfig };
