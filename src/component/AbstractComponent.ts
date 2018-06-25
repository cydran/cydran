import Component from "./Component";
import ContainerComponent from "./ContainerComponent";
import Logger from '../logger/Logger';
import LoggerFactory from '../logger/LoggerFactory';
import SequenceGenerator from '../SequenceGenerator';

abstract class AbstractComponent implements Component {

	private el: HTMLElement;

	private componentName: string;

	private parentView: ContainerComponent;

	private logger: Logger;

	constructor(componentName: string) {
		this.componentName = componentName;
		this.logger = LoggerFactory.getLogger(componentName + ' Component ' + SequenceGenerator.INSTANCE.next());
	}

	public setEl(el: HTMLElement): void {
		this.el = el;
		this.el.setAttribute('data-c-component-type', this.componentName);
		this.render();
		this.wire();
	}

	public setParentView(parentView: Component): void {
		this.parentView = <ContainerComponent>parentView;
	}

	public dispose(): void {
		this.unwire();
		this.parentView = null;
	}

	protected getEl(): HTMLElement {
		return this.el;
	}

	protected getParentView(): ContainerComponent {
		return this.parentView;
	}

	protected getLogger(): Logger {
		return this.logger;
	}

	protected abstract render(): void;

	protected abstract wire(): void;

	protected abstract unwire(): void;

}

export default AbstractComponent;