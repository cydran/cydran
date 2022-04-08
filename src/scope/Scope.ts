interface Scope {

	// TODO - Review the name of the add method for alternatives such as set() or put() as it can be called more than once and is not appending the values
	add(name: string, item: any): void;

	remove(name: string): void;

}

export default Scope;
