abstract class CydranError extends Error {

	public readonly message: string;

	/**
	 * Constructor
	 *
	 * @param msg string object specific to context
	 */
	constructor(msg: string) {
		super();

		this.name = new.target.name;
		this.message = msg;
	}

}

class AmbiguousMarkupError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class DigestLoopError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class InvalidTypeError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class LockedRegionError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class MalformedOnEventError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class ModuleAffinityError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class NullValueError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class RecursionError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class RegistrationError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class ScopeError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class SelectorError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class SetComponentError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class TemplateError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class UnknownComponentError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class UnknownElementError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class UnknownRegionError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class ValidationError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class UnknownStateError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}
class UnknownInputError extends CydranError {

	constructor(msg: string) {
		super(msg);
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
	ValidationError,
	UnknownStateError,
	UnknownInputError
};
