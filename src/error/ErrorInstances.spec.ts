import DigestLoopError from "@/error/DigestLoopError";
import MalformedOnEventError from "@/error/MalformedOnEventError";
import NullValueError from "@/error/NullValueError";
import RegistrationError from "@/error/RegistrationError";
import ScopeError from "@/error/ScopeError";
import SelectorError from "@/error/SelectorError";
import SetComponentError from "@/error/SetComponentError";
import TemplateError from "@/error/TemplateError";
import UnknownRegionError from "@/error/UnknownRegionError";
import { assert } from "chai";
import { describe, it } from "mocha";

const errors: any[] = [
		DigestLoopError,
		MalformedOnEventError,
		NullValueError,
		RegistrationError,
		ScopeError,
		SelectorError,
		SetComponentError,
		TemplateError,
		UnknownRegionError
	];

describe("CydranError Instance tests", () => {
	const message: string = "test error";

	errors.forEach((errorClass) => {
		const instance = new errorClass(message);

		it("new " + instance.name + "() - instantiation", () => {
			assert.isNotNull(instance, "is null");
		});

		it(errorClass.name + " instanceof Error", () => {
			assert.isTrue(instance instanceof Error, "not an instance of Error");
		});

		it(errorClass.name + " correct message", () => {
			assert.equal(message, instance.message, "message not correct");
		});
	});

});
