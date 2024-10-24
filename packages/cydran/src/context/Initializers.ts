interface Initializers<C> {

	add(thisObject: Object, callback: (context? : C) => void): void;

	execute(context: C): void;

}

export default Initializers;
