import Logger from "./logger/Logger";

interface Digestable {

	digest(guard?: any): void;

	$apply(fn: Function, args: any[], guard?: string): void;

}

export default Digestable;
