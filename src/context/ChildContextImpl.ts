import AbstractContextImpl from "context/AbstractContextImpl";
import Context from "context/Context";
import { requireNotNull } from 'util/Utils';

class ChildContextImpl extends AbstractContextImpl {

	private parent: Context;

	private root: Context;

	constructor(name: string, parent: Context) {
		super(name);
		this.parent = requireNotNull(parent, "parent");
		this.root = parent.getRoot();
	}

	public getParent(): Context {
		return this.parent;
	}

	public isRoot(): boolean {
		return false;
	}

	public getRoot(): Context {
		return this.root;
	}

}

export default ChildContextImpl;
