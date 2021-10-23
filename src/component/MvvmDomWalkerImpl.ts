import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import ScriptVisitor from "component/visitor/ScriptVisitor";
import DomOperations from 'dom/DomOperations';
import { requireNotNull } from 'util/Utils';

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(domOperations: DomOperations) {
		super();
		requireNotNull(domOperations, "domOperations");
		this.setTextVisitor(new TextVisitor(domOperations));
		this.setDefaultVisitor(new OtherVisitor(domOperations));
		this.addVisitor("script", new ScriptVisitor(domOperations));
	}

}

export default MvvmDomWalkerImpl;
