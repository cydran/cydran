import SimpleMap from "interface/SimpleMap";

interface FieldValidations<C> extends SimpleMap<((field: any, instance: any, context: C) => string)[]> {

	// Intentionally empty

}

export default FieldValidations;
