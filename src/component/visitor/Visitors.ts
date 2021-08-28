import SimpleMap from "interface/SimpleMap";
import ElementVisitor from "component/visitor/ElementVisitor";
import RegionVisitor from "component/visitor/RegionVisitor";

const VISITORS: SimpleMap<ElementVisitor<HTMLScriptElement, any>> = {
	region: new RegionVisitor()
};

export default VISITORS;
