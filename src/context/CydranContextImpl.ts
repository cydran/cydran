import CydranContext from "context/CydranContext";
import Dom from "dom/Dom";
import Factories from "factory/Factories";
import FactoriesImpl from "factory/FactoriesImpl";
import { requireNotNull } from 'util/Utils';

class CydranContextImpl implements CydranContext {

	private dom: Dom;

	private factories: Factories;

	constructor(dom: Dom) {
		this.dom = requireNotNull(dom, "dom");
		this.factories = new FactoriesImpl(this);
	}

	public getDom(): Dom {
		return this.dom;
	}

	public getFactories(): Factories {
		return this.factories;
	}

}

export default CydranContextImpl;
