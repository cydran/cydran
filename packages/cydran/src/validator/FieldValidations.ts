import SimpleMap from "interface/SimpleMap";

interface FieldValidations<S> extends SimpleMap<((field: any, instance: any, state: S) => string)[]> {

	// Intentionally empty

}

export default FieldValidations;
