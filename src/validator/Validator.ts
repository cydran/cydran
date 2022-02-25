import FieldValidations from "validator/FieldValidations";

interface Validator<T,C> {

	validate(values: T, context?: C, prefix?: string): string[];

	setValidations(validations: FieldValidations<C>): void;

}

export default Validator;
