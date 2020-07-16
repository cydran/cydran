import { requireNotNull } from '@/util/ObjectUtils';
import Renderer from "@/component/Renderer";

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