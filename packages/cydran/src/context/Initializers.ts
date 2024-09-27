interface Initializers<C> {

	add(thisObject: any, callback: (context? : C) => void): void;

	execute(context: C): void;

}

export default Initializers;
