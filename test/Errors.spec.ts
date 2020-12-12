import {
	DigestLoopError,
	MalformedOnEventError,
	NullValueError,
	RegistrationError,
	ScopeError,
	SelectorError,
	SetComponentError,
	TemplateError,
	UnknownRegionError
} from "error/Errors";

import CydranError from 'error/CydranError';

class TestError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

const emsg: string = "test error";

test("new TestError()", () => {
	const errobj = new TestError(emsg);
	expect(errobj).toBeInstanceOf(Error);
});

test("this instanceof Error", () => {
	const errobj = new TestError(emsg);
	expect(errobj).not.toBeNull();
	expect(errobj).toBeInstanceOf(Error);
});

test("provides the correct message", () => {
	const errobj = new TestError(emsg);
	expect(emsg).toEqual(errobj.message);
});

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
