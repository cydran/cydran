import Getter from "@/model/Getter";
import ScopeImpl from "@/model/ScopeImpl";
import Setter from "@/model/Setter";

class ExternalMediator<T> {

	private getter: Getter<T>;

	private setter: Setter<T>;

	constructor(expression: string) {
		this.getter = new Getter(expression);
		this.setter = new Setter(expression);
	}

	public get(scope: ScopeImpl): T {
		return this.getter.get(scope);
	}

	public set(scope: ScopeImpl, value: T): void {
		this.setter.set(scope, value);
	}

}

export default ExternalMediator;
