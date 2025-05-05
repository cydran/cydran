interface Type<T> extends Function {

	// eslint:disable-next-line
	new (...args: unknown[]): T;

}

export default Type;
