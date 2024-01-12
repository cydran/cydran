interface Initializers<C> {

	add(callback: (context? : C) => void): void;

	execute(context: C): void;

}

export default Initializers;
