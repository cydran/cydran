import { isDefined, startsWith } from "util/Utils";
import { SelectorError } from "error/Errors";
import ModulesContext from "module/ModulesContext";
import ModulesContextImpl from "module/ModulesContextImpl";
import Renderer from "component/Renderer";
import IdentityRendererImpl from "component/renderer/IdentityRendererImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import InternalDom from "dom/InternalDom";
import DomImpl from "dom/DomImpl";
import CydranContext from "context/CydranContext";
import CydranContextImpl from "context/CydranContextImpl";

// TODO - Allow passing of arbitrary window object
function create(selector: string, initialValues?: any): void {
	const dom: InternalDom = new DomImpl();
	const cydranContext: CydranContext = new CydranContextImpl(dom);

	dom.onReady(() => {
		const elements: NodeListOf<HTMLElement> = dom.getDocument().querySelectorAll(selector);
		const eLength = elements ? elements.length : 0;
		if (eLength !== 1) {
			throw new SelectorError(`CSS selector MUST identify single HTMLElement: '${selector}' - ${eLength} found`);
		}

		const moduleContext: ModulesContext = new ModulesContextImpl(cydranContext);
		const element: HTMLElement = elements[0];
		const renderer: Renderer = new IdentityRendererImpl(element);
		const root: Component = new Component(renderer, { module: moduleContext.getDefaultModule(), alwaysConnected: true } as ComponentOptions);

		if (isDefined(initialValues)) {
			for (const key in initialValues) {
				if (!initialValues.hasOwnProperty(key) || startsWith(key, "$")) {
					continue;
				}

				root[key] = initialValues[key];
			}
		}

		root.$c().tell("setParent", null);
		root.$c().tell("digest", null);

		window["rootCydranInstance"] = root;
	});
}

export default create;
