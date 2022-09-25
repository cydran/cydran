import PropertyKeys from "const/PropertyKeys";
import AbstractContextImpl from "context/AbstractContextImpl";
import Context from "context/Context";
import InternalDom from "dom/InternalDom";
import SimpleMap from "interface/SimpleMap";
import { MutableProperties } from "properties/Property";
import DomImpl from 'dom/DomImpl';
import PropertiesImpl from "properties/PropertiesImpl";
import DEFAULT_PROPERTIES_VALUES from "SysProps";
import ScopeImpl from "scope/ScopeImpl";
import COMPARE from "const/Compare";
import ServicesImpl from "service/ServicesImpl";
import Services from "service/Services";

class RootContextImpl extends AbstractContextImpl {

	private dom: InternalDom;

	private rootproperties: MutableProperties;

	private properties: MutableProperties;

	private rootScope: ScopeImpl;

	private scope: ScopeImpl;

	private services: Services;

	constructor(properties: SimpleMap<any> = {}) {
		super("root");
		const windowInstance: Window = properties[PropertyKeys.CYDRAN_OVERRIDE_WINDOW];
		this.dom = new DomImpl(windowInstance);
		this.rootScope = new ScopeImpl();
		this.rootScope.add("compare", COMPARE);
		this.scope = new ScopeImpl();
		this.scope.setParent(this.rootScope);
		this.rootproperties = new PropertiesImpl();
		this.rootproperties.load(DEFAULT_PROPERTIES_VALUES);
		this.properties = this.rootproperties.extend() as PropertiesImpl;
		this.properties.load(properties);
		this.services = new ServicesImpl(this.dom, this.properties);
	}

	public getParent(): Context {
		return this;
	}

	public isRoot(): boolean {
		return true;
	}

	public getRoot(): Context {
		return this;
	}

}

export default RootContextImpl;
