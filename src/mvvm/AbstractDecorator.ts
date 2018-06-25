import ElementDecorator from "./Decorator";
import Mvvm from "./Mvvm";
import View from "../component/Component";

abstract class AbstractElementDecorator<T> implements ElementDecorator {

	private el: HTMLElement;

	private model: any;

	private expression: string;

	private value: any;

	private mvvm: Mvvm;

	private parentView: View;

	constructor(mvvm: Mvvm, parentView: View, el: HTMLElement, expression: string, model: any) {
		this.el = el;
		this.expression = expression;
		this.model = model;
		this.value = null;
		this.mvvm = mvvm;
		this.wire();
		this.parentView = parentView;
	}

	public dispose(): void {
		this.unwire();
		this.model = null;
		this.value = null;
		this.mvvm = null;
		this.parentView = null;
	}

	protected getEl(): HTMLElement {
		return this.el;
	}

	protected getModel(): any {
		return this.model;
	}

	protected getParentView(): View {
		return this.parentView;
	}

	protected invokeTarget(...args: any[]): void {
		let code: string = '"use strict"; (' + this.expression + ');';
		Function(code).apply(this.model, args);

		if (this.mvvm) {
			this.mvvm.evaluateModel();
		}
	}

	protected getTarget(): T {
		let code: string = '"use strict"; ' + Mvvm.getFiltersCode() + ' return (' + this.expression + ');';
		this.value = Function(code).apply(this.model, [Mvvm.getFilters()]);

		console.log(this);
		console.log(this.value + ' --- ' + code);

		return this.value;
	}

	protected setTarget(value: T): void {
		let code: string = '"use strict"; ' + this.expression + '= arguments[0];';
		this.value = value;

		Function(code).apply(this.model, [value]);

		this.mvvm.evaluateModel();
	}

	public evaluateModel(): void {
		let oldValue: any = this.value;
		this.getTarget();

		if (!this.isEqual(oldValue, this.value)) {
			this.onTargetChange(this.value);
		}
	}

	private isEqual(first: any, second: any): boolean {
		// TODO - Implement a deep equals

		return (first == second);
	}

	protected abstract wire(): void;

	protected abstract unwire(): void;

	protected abstract onTargetChange(value: any): void;

}

export default AbstractElementDecorator;