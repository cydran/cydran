import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import NonOpVisitor from "component/visitor/NonOpVisitor";
import ComponentStylesVisitor from "component/visitor/ComponentStylesVisitor";
import RegionVisitor from 'component/visitor/RegionVisitor';
import OtherVisitor from "component/visitor/OtherVisitor";
import TextVisitor from "component/visitor/TextVisitor";
import Logger from "log/Logger";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(textVisitor: TextVisitor, otherVisitor: OtherVisitor, logger: Logger) {
		super(otherVisitor, textVisitor, new NonOpVisitor());
		this.addVisitor("c-component-styles", new ComponentStylesVisitor());
		this.addVisitor("c-region", new RegionVisitor(logger));
	}

}

export default MvvmDomWalkerImpl;
