import CydranError from "error/CydranError";

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

class InvalidStateError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class UnknownInputError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class ComponentStateError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class BehaviorError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class IllegalArgumentError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class OutputStrategyError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class EvaluationError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

class UndefinedModuleError extends CydranError {

	constructor(msg: string) {
		super(msg);
	}

}

export {
	BehaviorError,
	CydranError,
	ComponentStateError,
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
	InvalidStateError,
	UnknownInputError,
	IllegalArgumentError,
	OutputStrategyError,
	EvaluationError,
	UndefinedModuleError
};
