import Renderer from "component/Renderer";
import { SelectorError } from "error/Errors";
import { Attrs, TagNames, ATTRIBUTE_DELIMITER, DEFAULT_PREFIX, STAGE_BODY_REGION_NAME } from "CydranConstants";
import DomUtils from "dom/DomUtils";
import SeriesElement from "element/SeriesElement";
import { requireNotNull } from 'util/Utils';

const CYDRAN_PREFIX: string = DEFAULT_PREFIX + ATTRIBUTE_DELIMITER;

class StageRendererImpl implements Renderer {

	private selector: string;

	constructor(selector: string) {
		this.selector = requireNotNull(selector, "selector");
	}

	public render(): HTMLElement {
		const elements: NodeListOf<HTMLElement> = DomUtils.getDocument().querySelectorAll(this.selector);

		const eLength = elements ? elements.length : 0;

		if (eLength !== 1) {
			throw new SelectorError(`CSS selector MUST identify single HTMLElement: '${this.selector}' - ${eLength} found`);
		}

		const element: HTMLElement = elements[0];

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		const topSeries: SeriesElement = DomUtils.createElement(TagNames.CYDRAN_SERIES);
		topSeries.setAttribute(Attrs.NAME, "top");
		element.appendChild(topSeries);

		const regionDiv: HTMLElement = DomUtils.createElement(TagNames.CYDRAN_REGION);
		regionDiv.setAttribute(Attrs.NAME, STAGE_BODY_REGION_NAME);
		element.appendChild(regionDiv);

		const bottomSeries: SeriesElement = DomUtils.createElement(TagNames.CYDRAN_SERIES);
		bottomSeries.setAttribute(Attrs.NAME, "bottom");
		element.appendChild(bottomSeries);

		return element;
	}
}

export default StageRendererImpl;
