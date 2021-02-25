import DomWalkerImpl from "element/DomWalkerImpl";
import { Mvvm } from "internals/Shuttle";
import TextVisitor from "element/visitor/TextVisitor";
import OtherVisitor from "element/visitor/OtherVisitor";
import ScriptVisitor from "element/visitor/ScriptVisitor";

class MvvmDomWalkerImpl extends DomWalkerImpl<Mvvm> {
	constructor() {
		super();
		this.setTextVisitor(new TextVisitor());
		this.setDefaultVisitor(new OtherVisitor());
		this.addVisitor("script", new ScriptVisitor());
	}
}

export default MvvmDomWalkerImpl;