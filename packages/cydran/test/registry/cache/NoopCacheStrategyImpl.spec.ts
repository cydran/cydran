import { describe, expect, test } from '@jest/globals';
import CacheStrategy from "registry/cache/CacheStrategy";
import NoopCacheStrategyImpl from "registry/cache/NoopCacheStrategyImpl";

describe("NoopCacheStrategyImpl", () => {

	const specimen: CacheStrategy<string> = new NoopCacheStrategyImpl<string>();

	test("Null value", () => {
		const result: string = specimen.resolve(() => null);

		expect(result).toBeNull();
	});

	test("Non-null value", () => {
		const results: string[] = [];
		results.push(specimen.resolve(() => "Alpha"));
		results.push(specimen.resolve(() => "Beta"));
		results.push(specimen.resolve(() => "Gamma"));

		expect(results).toEqual(["Alpha", "Beta", "Gamma"]);
	});

});
