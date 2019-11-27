import Guard from "./Guard";

interface Digestable {

	digest(guard?: Guard): void;

	$apply(fn: Function, args: any[], guard?: Guard): void;

}

export default Digestable;
