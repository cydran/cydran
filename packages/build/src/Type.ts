interface Type<T> extends Function {

	// eslint:disable-next-line
	new (...args: any[]): T;

}

export default Type;
