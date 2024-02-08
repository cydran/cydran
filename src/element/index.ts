import { isDefined } from "util/Utils";
import RegionElement from 'element/RegionElement';

if (!isDefined(customElements.get("c-region"))) {
	customElements.define("c-region", RegionElement);
}
