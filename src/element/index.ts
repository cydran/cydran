import { isDefined } from "util/Utils";
import RegionElement from 'element/RegionElement';
import ComponentStylesElement from 'element/ComponentStylesElement';

if (!isDefined(customElements.get("c-region"))) {
	customElements.define("c-region", RegionElement);
}

if (!isDefined(customElements.get("c-region"))) {
	customElements.define("c-component-styles", ComponentStylesElement);
}
