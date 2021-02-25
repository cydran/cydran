import Renderer from "element/Renderer";
import { requireNotNull } from "util/Utils";

class IdentityRendererImpl implements Renderer {
	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public render(): HTMLElement {
		return this.element;
	}
}

export default IdentityRendererImpl;