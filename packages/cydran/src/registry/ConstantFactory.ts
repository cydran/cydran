import Factory from "registry/Factory";
import Gettable from "interface/ables/Gettable";

class ConstantFactory<T> implements Factory<T> {

	private instance: T;

	constructor(instance: T) {
		this.instance = instance;
	}

	public get(gettable: Gettable, instanceArguments: any[] = []): T {
		return this.instance;
	}

	public $release(): void {
		this.instance = null;
	}

}

export default ConstantFactory;
