import Gettable from "interface/ables/Gettable";

interface ArgumentsHolder extends Gettable {
	
	add<T>(value: T): void;

	getAll(): any[];

}

export default ArgumentsHolder;
