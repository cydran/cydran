import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(textVisitor, otherVisitor, scriptVisitor) {
		super();
		this.setTextVisitor(textVisitor);
		this.setDefaultVisitor(otherVisitor);
		this.addVisitor("script", scriptVisitor);
	}

}

export default MvvmDomWalkerImpl;
