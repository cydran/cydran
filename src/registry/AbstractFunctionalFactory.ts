import Factory from "registry/Factory";
import Disposable from "interface/ables/Disposable";
import Gettable from "interface/ables/Gettable";

import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context } from "context/Context";

abstract class AbstractFunctionalFactory<T> implements Factory<T>, Disposable {

	private fn: (args: any[]) => T;

	private argumentResolvers: ArgumentsResolvers;

	private context: Context;

	constructor(context: Context, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		this.context = context;
		this.argumentResolvers = argumentResolvers;
		this.fn = fn;
	}

	public abstract get(gettable: Gettable): T;

	protected create(gettable: Gettable) {
		const params: any[] = this.argumentResolvers.resolve(this.context);
		const result: T = this.fn.apply({}, params);
		this.argumentResolvers.postProcess(this.context, result, params);

		return result;
	}

	public abstract $dispose(): void;

}

export default AbstractFunctionalFactory;
