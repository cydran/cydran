import Guard from "@/Guard";

interface Digestable {

	$apply(fn: Function, args: any[], guard?: Guard): void;

}

export default Digestable;
