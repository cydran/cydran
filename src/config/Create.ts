import { isDefined, startsWith } from "util/Utils";
import { SelectorError } from "error/Errors";
import Renderer from "component/Renderer";
import IdentityRendererImpl from "component/renderer/IdentityRendererImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import RootContextImpl from "context/RootContextImpl";
import InternalContext from "context/InternalContext";
import DomUtils from "dom/DomUtils";

// TODO - Allow passing of arbitrary window object
function create(selector: string, initialValues?: any): void {
	const context: InternalContext = new RootContextImpl(selector, {});

	DomUtils.onReady(() => {
		const elements: NodeListOf<HTMLElement> = DomUtils.getDocument().querySelectorAll(selector);
		const eLength = elements ? elements.length : 0;
		if (eLength !== 1) {
			throw new SelectorError(`CSS selector MUST identify single HTMLElement: '${selector}' - ${eLength} found`);
		}

		const element: HTMLElement = elements[0];
		const renderer: Renderer = new IdentityRendererImpl(element);
		const root: Component = new Component(renderer, { alwaysConnected: true } as ComponentOptions);

		if (isDefined(initialValues)) {
			for (const key in initialValues) {
				if (!initialValues.hasOwnProperty(key) || startsWith(key, "$")) {
					continue;
				}

				root[key] = initialValues[key];
			}
		}

		root.$c().tell("setContext", context);
		root.$c().tell("setParent", null);
		root.$c().tell("digest", null);

		window["rootCydranInstance"] = root;
	});
}

export default create;
