import { isDefined } from "util/Utils";
import RegionElement from "element/RegionElement";
import ComponentStylesElement from "element/ComponentStylesElement";
import Type from "interface/Type";
import SeriesElement from "element/SeriesElement";

function register<T extends HTMLElement>(tag: string, elClass: Type<T>) {
	if (!isDefined(customElements.get(tag))) {
		customElements.define(tag, elClass);
	}
}

register("c-region", RegionElement);
register("c-component-styles", ComponentStylesElement);
register("c-series", SeriesElement);
