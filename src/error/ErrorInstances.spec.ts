import DigestLoopError from "@/error/DigestLoopError";
import MalformedOnEventError from "@/error/MalformedOnEventError";
import NullValueError from "@/error/NullValueError";
import RegistrationError from "@/error/RegistrationError";
import ScopeError from "@/error/ScopeError";
import SelectorError from "@/error/SelectorError";
import SetComponentError from "@/error/SetComponentError";
import TemplateError from "@/error/TemplateError";
import UnknownRegionError from "@/error/UnknownRegionError";

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

const message: string = "test error";

errors.forEach((errorClass) => {
	const instance = new errorClass(message);

	test("new " + instance.name + "() - instantiation", () => {
		expect(instance).not.toBeNull();
	});

	test(errorClass.name + " instanceof Error", () => {
		expect(instance).toBeInstanceOf(Error);
	});

	test(errorClass.name + " correct message", () => {
		expect(message).toEqual(instance.message);
	});
});
