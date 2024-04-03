import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import NonOpVisitor from "component/visitor/NonOpVisitor";
import ComponentStylesVisitor from "component/visitor/ComponentStylesVisitor";
import RegionVisitor from 'component/visitor/RegionVisitor';

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(textVisitor, otherVisitor, scriptVisitor) {
		super(otherVisitor, textVisitor, new NonOpVisitor());
		this.addVisitor("script", scriptVisitor);
		this.addVisitor("c-component-styles", new ComponentStylesVisitor());
		this.addVisitor("c-region", new RegionVisitor());
	}

}

export default MvvmDomWalkerImpl;
