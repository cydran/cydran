abstract class CydranError extends Error {

	private static doMsgFilling(msg: string, reps: any): string {
		return msg.replace(/%\w+%/g, (all: string) => (reps[all] + "") || all);
	}

	public readonly message: string;

	/**
	 * Constructor
	 *
	 * @param msg string object specific to context
	 * @param reps optional {key:value, <n^1>} object of named substitution values
	 * @returns string filled in values in the mesage
	 */
	constructor(msg: string, reps?: any) {
		super();

		this.name = new.target.name;
		this.message = (reps) ? CydranError.doMsgFilling(msg, reps) : msg;
	}

}

class AmbiguousMarkupError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class DigestLoopError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class InvalidTypeError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class LockedRegionError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class MalformedOnEventError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class ModuleAffinityError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class NullValueError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class RecursionError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class RegistrationError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class ScopeError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class SelectorError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class SetComponentError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class TemplateError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class UnknownComponentError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class UnknownElementError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class UnknownRegionError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

class ValidationError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export {
	CydranError,
	AmbiguousMarkupError,
	DigestLoopError,
	InvalidTypeError,
	LockedRegionError,
	MalformedOnEventError,
	ModuleAffinityError,
	NullValueError,
	RecursionError,
	RegistrationError,
	ScopeError,
	SelectorError,
	SetComponentError,
	TemplateError,
	UnknownComponentError,
	UnknownElementError,
	UnknownRegionError,
	ValidationError
};
