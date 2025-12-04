interface Digestable {

	sync(fn: (...syncArguments: unknown[]) => void, args: unknown[]): unknown;

}

export default Digestable;
