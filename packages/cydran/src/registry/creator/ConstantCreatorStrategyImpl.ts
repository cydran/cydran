import CreatorStrategy from "registry/creator/CreatorStrategy";

class ConstantCreatorStrategyImpl<T> implements CreatorStrategy<T> {

	private instance: T;

	constructor(instance: T) {
		this.instance = instance;
	}

	public create(): (argumentValues: any[]) => T {
		return () => this.instance;
	}

	public $release(): void {
		this.instance = null;
	}

}

export default ConstantCreatorStrategyImpl;
