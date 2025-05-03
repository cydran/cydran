import SimpleMap from "interface/SimpleMap";

interface FieldValidations<S> extends SimpleMap<((field: unknown, instance: unknown, state: S) => string)[]> {

	// Intentionally empty

}

export default FieldValidations;
