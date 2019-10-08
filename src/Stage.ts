import Config from "./Config";
import {Component} from "./Core";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import DomUtils from "./DomUtils";
import SelectorError from "./error/SelectorError";

class StageComponent extends Component {

	constructor(selector: string) {
		super("stage", selector);
	}

	public setComponent(component: Component): StageComponent {
		this.setChild("body", component);

		return this;
	}

	protected render(): void {
		const elements: NodeListOf<HTMLElement> = document.querySelectorAll(this.getTemplate());

		const eLength = elements.length;
		const errMsg = (eLength !== 1) ?
			"CSS selector MUST identify single HTMLElement: %pattern% - %found% found" : null;

		if (errMsg) {
			const patSubObj = {'%pattern%': this.getTemplate(), '%found%': eLength};
			const errObj: SelectorError = new SelectorError(errMsg, patSubObj);
			this.getLogger().fatal("", errObj);
			throw errObj;
		}

		const element: HTMLElement = elements[0];

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		const regionDiv: HTMLElement = document.createElement("div");
		regionDiv.setAttribute("data-c-region", "body");
		element.appendChild(regionDiv);
		this.setEl(element);
	}

}

class Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: Array<(() => void)>;

	private root: StageComponent;

	constructor(rootSelector: string) {
		this.logger = LoggerFactory.getLogger("Stage");
		this.started = false;
		this.rootSelector = rootSelector;
		this.initializers = [];
		this.root = null;
	}

	public withInitializer(callback: () => void): Stage {
		this.initializers.push(callback);

		return this;
	}

	public start(): void {
		this.logger.debug("Start Requested");

		if (this.started) {
			this.logger.debug("Aleady Started");
			return;
		}

		this.logger.debug("Cydran Starting");

		DomUtils.domReady(() => this.domReady());
	}

	public setComponent(component: Component): Stage {
		this.root.setChild("body", component);

		return this;
	}

	public get<T>(id: string): T {
		return this.root.get(id);
	}

	public getConfig(): Config {
		return new Config();
	}

	private domReady(): void {
		this.logger.debug("DOM Ready");
		this.root = new StageComponent(this.rootSelector);
		this.root.setParent(null);
		this.started = true;
		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this);
		}

		this.logger.debug("Startup Complete");
	}

}

export default Stage;
