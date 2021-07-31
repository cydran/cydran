import Validators from "validator/Validators";

interface Validator {

	getFunction(): (name: string, value?: any) => Validators;

	throwIfErrors(prefixFn: () => string): void;

}

export default Validator;
