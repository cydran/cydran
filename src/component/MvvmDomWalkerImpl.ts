import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import ScriptVisitor from "component/visitor/ScriptVisitor";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor() {
		super();
		this.setTextVisitor(new TextVisitor());
		this.setDefaultVisitor(new OtherVisitor());
		this.addVisitor("script", new ScriptVisitor());
	}

}

export default MvvmDomWalkerImpl;
