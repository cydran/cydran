import { domReady } from "@/util/DomUtils";
import SelectorError from "@/error/SelectorError";
import RootComponent from '@/stage/RootComponent';
import IdentityRendererImpl from "@/component/IdentityRendererImpl";
import ModulesContextImpl from "@/module/ModulesContextImpl";
import Renderer from "@/component/Renderer";
import ModulesContext from "@/module/ModulesContext";
import { isDefined } from "@/util/ObjectUtils";
import { startsWith } from "@/util/StringUtils";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";

function create(selector: string, initialValues?: any): void {
	domReady(() => {
		const elements: NodeListOf<HTMLElement> = window.document.querySelectorAll(selector);
		const eLength = ((elements) ? elements.length : 0);
		const errMsg = (eLength !== 1) ? "CSS selector MUST identify single HTMLElement: '%pattern%' - %qty% found" : null;

		if (errMsg) {
			const patSubObj = { "%pattern%": selector, "%qty%": eLength };
			throw new SelectorError(errMsg, patSubObj);
		}

		const moduleContext: ModulesContext = new ModulesContextImpl();
		const element: HTMLElement = elements[0];
		const renderer: Renderer = new IdentityRendererImpl(element);
		const root: RootComponent = new RootComponent(moduleContext.getDefaultModule(), renderer);

		if (isDefined(initialValues)) {
			for (const key in initialValues) {
				if (!initialValues.hasOwnProperty(key) || startsWith(key, "$")) {
					continue;
				}

				root[key] = initialValues[key];
			}
		}
		root.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
		root.message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", null);
		window["rootCydranInstance"] = root;
	});
}

export default create;