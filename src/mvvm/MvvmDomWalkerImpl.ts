import DomWalkerImpl from "@/dom/DomWalkerImpl";
import Mvvm from "@/mvvm/Mvvm";
import TextVisitor from "@/mvvm/TextVisitor";
import ScriptVisitor from "@/mvvm/ScriptVisitor";
import OtherVisitor from "@/mvvm/OtherVisitor";

class MvvmDomWalkerImpl extends DomWalkerImpl<Mvvm> {

	constructor() {
		super();
		this.setTextVisitor(new TextVisitor());
		this.setDefaultVisitor(new OtherVisitor());
		this.addVisitor("script", new ScriptVisitor());
	}

}

export default MvvmDomWalkerImpl;
