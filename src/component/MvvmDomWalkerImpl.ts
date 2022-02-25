import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import ScriptVisitor from "component/visitor/ScriptVisitor";
import { requireNotNull } from 'util/Utils';
import CydranContext from "context/CydranContext";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(cydranContext: CydranContext) {
		super();
		requireNotNull(cydranContext, "cydranContext");
		this.setTextVisitor(new TextVisitor(cydranContext));
		this.setDefaultVisitor(new OtherVisitor(cydranContext));
		this.addVisitor("script", new ScriptVisitor(cydranContext));
	}

}

export default MvvmDomWalkerImpl;
