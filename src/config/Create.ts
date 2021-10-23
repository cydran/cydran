import { isDefined, startsWith } from "util/Utils";
import { SelectorError } from "error/Errors";
import ModulesContext from "module/ModulesContext";
import ModulesContextImpl from "module/ModulesContextImpl";
import Renderer from "component/Renderer";
import IdentityRendererImpl from "component/renderer/IdentityRendererImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import InternalDomOperations from "dom/InternalDomOperations";
import DomOperationsImpl from "dom/DomOperationsImpl";

// TODO - Allow passing of arbitrary window object
function create(selector: string, initialValues?: any): void {
	const domOperations: InternalDomOperations = new DomOperationsImpl();

	domOperations.domReady(() => {
		const elements: NodeListOf<HTMLElement> = domOperations.getDocument().querySelectorAll(selector);
		const eLength = elements ? elements.length : 0;
		if (eLength !== 1) {
			throw new SelectorError(`CSS selector MUST identify single HTMLElement: '${selector}' - ${eLength} found`);
		}

		const moduleContext: ModulesContext = new ModulesContextImpl(domOperations);
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

		root.tell("setParent", null);
		root.tell("digest", null);

		window["rootCydranInstance"] = root;
	});
}

export default create;
