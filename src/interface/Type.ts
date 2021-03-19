interface Type<T> extends Function {

	// tslint:disable-next-line
	new(...args: any[]): T;

}

export default Type;