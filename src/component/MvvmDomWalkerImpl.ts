import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import ScriptVisitor from "component/visitor/ScriptVisitor";
import Dom from 'dom/Dom';
import { requireNotNull } from 'util/Utils';

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(dom: Dom) {
		super();
		requireNotNull(dom, "dom");
		this.setTextVisitor(new TextVisitor(dom));
		this.setDefaultVisitor(new OtherVisitor(dom));
		this.addVisitor("script", new ScriptVisitor(dom));
	}

}

export default MvvmDomWalkerImpl;
