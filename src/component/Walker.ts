import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import TextVisitor from "component/visitor/TextVisitor";
import OtherVisitor from "component/visitor/OtherVisitor";
import ScriptVisitor from "component/visitor/ScriptVisitor";
import DomWalker from "component/DomWalker";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor() {
		super();
		this.setTextVisitor(new TextVisitor());
		this.setDefaultVisitor(new OtherVisitor());
		this.addVisitor("script", new ScriptVisitor());
	}

}

class Walker {

	private static walker: DomWalker<ComponentInternals> = new MvvmDomWalkerImpl();

	public static walk(root: HTMLElement, internals: any): void {
		Walker.walker.walk(root, internals);
	}

}

export default Walker;
