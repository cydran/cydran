import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { CydranError } from "@/error/AbstractCydranError";
import DigestLoopError from "@/error/DigestLoopError";
import MalformedOnEventError from "@/error/MalformedOnEventError";
import NullValueError from "@/error/NullValueError";
import RegistrationError from "@/error/RegistrationError";
import ScopeError from "@/error/ScopeError";
import SelectorError from "@/error/SelectorError";
import SetComponentError from "@/error/SetComponentError";
import TemplateError from "@/error/TemplateError";
import UnknownRegionError from "@/error/UnknownRegionError";


describe("CydranError Instance tests", () => {
	const emsg: string = "test error";

	[DigestLoopError, MalformedOnEventError, NullValueError, RegistrationError, ScopeError, SelectorError, SetComponentError, TemplateError, UnknownRegionError].forEach((e) => {
		const errobj = new e(emsg);
		it("new " + errobj.name + "() - instantiation", () => {
			assert.isNotNull(errobj, "is null");
		});

		it(e.name + " instanceof Error", () => {
			assert.isTrue(errobj instanceof Error, "not an instance of Error");
		});

		it(e.name + " correct message", () => {
			assert.equal(emsg, errobj.message, "message not correct");
		});
	});

});
