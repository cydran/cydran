import FieldValidations from "validator/FieldValidations";

interface Validator<T,S> {

	validate(values: T, state?: S, prefix?: string): string[];

	setValidations(validations: FieldValidations<S>): void;

}

export default Validator;
