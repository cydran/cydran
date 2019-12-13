class Deferred<S, T> {

	private instance: T;

	private factory: (source: S) => T;

	constructor(factory: (source: S) => T) {
		this.factory = factory;
	}

	public get(source: S): T {
		if (!this.instance) {
			this.instance = this.factory(source);
		}

		return this.instance;
	}

}

export default Deferred;
