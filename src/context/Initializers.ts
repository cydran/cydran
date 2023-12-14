import Context from "context/Context";

interface Initializers<C extends Context> {

	add(callback: (context? : C) => void): void;

	execute(context: C): void;

}

export default Initializers;
