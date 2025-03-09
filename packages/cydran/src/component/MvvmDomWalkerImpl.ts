import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import NonOpVisitor from "component/visitor/NonOpVisitor";
import ComponentStylesVisitor from "component/visitor/ComponentStylesVisitor";
import RegionVisitor from 'component/visitor/RegionVisitor';
import OtherVisitor from "component/visitor/OtherVisitor";
import TextVisitor from "component/visitor/TextVisitor";
import SeriesVisitor from "component/visitor/SeriesVisitor";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(textVisitor: TextVisitor, otherVisitor: OtherVisitor) {
		super(otherVisitor, textVisitor, new NonOpVisitor());
		this.addVisitor("c-component-styles", new ComponentStylesVisitor());
		this.addVisitor("c-region", new RegionVisitor());
		this.addVisitor("c-series", new SeriesVisitor());
	}

}

export default MvvmDomWalkerImpl;
