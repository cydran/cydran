import AbstractComponent from "./AbstractComponent";
import Mvvm from "../mvvm/Mvvm";

abstract class MvvmComponent extends AbstractComponent {

	private template: Function;

	private mvvm: Mvvm;

	constructor(componentName: string, template: Function) {
		super(componentName);
		this.template = template;
		this.mvvm = new Mvvm(this);
	}

	protected render(): void {
		this.getEl().innerHTML = this.template(this);
	}

	protected wire(): void {
		this.mvvm.init(this.getEl(), this);
	}

	protected unwire(): void {
		this.mvvm.dispose();
	}

	protected $apply(fn: Function, ...args: any[]): void {
		this.mvvm.$apply(fn, args);
	}

}

export default MvvmComponent;