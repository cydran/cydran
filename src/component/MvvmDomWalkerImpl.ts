import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import ScriptVisitor from "component/visitor/ScriptVisitor";
import { requireNotNull } from 'util/Utils';
import Services from "service/Services";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(services: Services) {
		super();
		requireNotNull(services, "services");
		this.setTextVisitor(new TextVisitor(services));
		this.setDefaultVisitor(new OtherVisitor(services));
		this.addVisitor("script", new ScriptVisitor(services));
	}

}

export default MvvmDomWalkerImpl;
