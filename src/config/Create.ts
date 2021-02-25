import { domReady, isDefined, startsWith } from "util/Utils";
import { SelectorError } from "error/Errors";
import ModulesContext from "module/ModulesContext";
import ModulesContextImpl from "module/ModulesContextImpl";
import Renderer from "element/Renderer";
import IdentityRendererImpl from "element/render/IdentityRendererImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";

function create(selector: string, initialValues?: any): void {
	domReady(() => {
		const elements: NodeListOf<HTMLElement> = window.document.querySelectorAll(selector);
		const eLength = elements ? elements.length : 0;
		if (eLength !== 1) {
			throw new SelectorError(
				`CSS selector MUST identify single HTMLElement: '${selector}' - ${eLength} found`
			);
		}

		const moduleContext: ModulesContext = new ModulesContextImpl();
		const element: HTMLElement = elements[0];
		const renderer: Renderer = new IdentityRendererImpl(element);
		const root: Component = new Component(renderer, {
			module: moduleContext.getDefaultModule(),
			alwaysConnected: true
		} as ComponentOptions);

		if (isDefined(initialValues)) {
			for (const key in initialValues) {
				if (!initialValues.hasOwnProperty(key) || startsWith(key, "$")) {
					continue;
				}

				root[key] = initialValues[key];
			}
		}

		root.tell("setParent", null);
		root.tell("digest", null);

		window["rootCydranInstance"] = root;
	});
}

export default create;
