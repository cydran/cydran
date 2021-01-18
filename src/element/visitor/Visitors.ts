import SimpleMap from "interface/SimpleMap";
import ElementVisitor from "element/visitor/ElementVisitor";
import RegionVisitor from "element/visitor/RegionVisitor";

const VISITORS: SimpleMap<ElementVisitor<HTMLScriptElement, any>> = {
	region: new RegionVisitor(),
};

export default VISITORS;