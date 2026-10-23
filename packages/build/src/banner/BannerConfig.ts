const SECTION_NAME: string = "banner";

interface BannerConfig {

	active: boolean;

	source: string;

	targets: string[];

}

function isActive(raw: any): boolean {
	const active: unknown = (raw === null || raw === undefined) ? false : raw["active"];

	if (typeof active !== "boolean") {
		throw new Error(`${SECTION_NAME}.active must be a boolean`);
	}

	return active;
}

function readBannerConfig(raw: any): BannerConfig {
	const active: boolean = isActive(raw);

	if (typeof raw["source"] !== "string" || raw["source"].length === 0) {
		throw new Error(`${SECTION_NAME}.source must be a non-empty string`);
	}

	if (!Array.isArray(raw["targets"]) || !raw["targets"].every((target: unknown) => typeof target === "string")) {
		throw new Error(`${SECTION_NAME}.targets must be an array of strings`);
	}

	return {
		active: active,
		source: raw["source"],
		targets: raw["targets"]
	};
}

const INACTIVE_NOTICE: string = `Banner inactive (${SECTION_NAME}.active is false); skipping`;

export { BannerConfig, SECTION_NAME, INACTIVE_NOTICE, isActive, readBannerConfig };
