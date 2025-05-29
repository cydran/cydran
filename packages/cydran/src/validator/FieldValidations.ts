import SimpleMap from "interface/SimpleMap";

type FieldValidations<S> = SimpleMap<((field: unknown, instance: unknown, state: S) => string)[]>;

export default FieldValidations;
