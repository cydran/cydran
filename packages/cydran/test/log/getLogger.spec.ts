import { describe, expect, test } from '@jest/globals';
import getLogger from 'log/getLogger';
import Logger from 'log/Logger';
import { requireNotNull } from "util/Utils";
import GlobalContextImpl from "context/GlobalContextImpl";

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

describe("getLogger", () => {

	test("Not null", () => {
		const specimen: Logger = getLogger("test", "test");
		expect(specimen).not.toBeNull();
	});
	
});
