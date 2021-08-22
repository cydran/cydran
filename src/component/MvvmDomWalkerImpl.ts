import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import TextVisitor from "element/visitor/TextVisitor";
import OtherVisitor from "element/visitor/OtherVisitor";
import ScriptVisitor from "element/visitor/ScriptVisitor";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor() {
		super();
		this.setTextVisitor(new TextVisitor());
		this.setDefaultVisitor(new OtherVisitor());
		this.addVisitor("script", new ScriptVisitor());
	}

}

export default MvvmDomWalkerImpl;
