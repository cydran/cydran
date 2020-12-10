import SimpleMap from "interface/SimpleMap";

interface BehaviorAttributeValidations<C> extends SimpleMap<((field: any, instance: any, context: C) => string)[]> {

	// Intentionally empty

}

export default BehaviorAttributeValidations;
