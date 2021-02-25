import Factory from "register/Factory";
import Gettable from "interface/ables/Gettable";

class ConstantFactory<T> implements Factory<T> {
	private instance: T;

	constructor(instance: T) {
		this.instance = instance;
	}

	public get(gettable: Gettable): T {
		return this.instance;
	}

	public $dispose(): void {
		this.instance = null;
	}
}

export default ConstantFactory;
