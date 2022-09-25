import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import BehaviorsRegistryImpl from "behavior/BehaviorsRegistryImpl";
import Services from "service/Services";
import Dom from "dom/Dom";
import Factories from "factory/Factories";
import FactoriesImpl from "factory/FactoriesImpl";
import { requireNotNull } from 'util/Utils';
import LoggerFactory from "log/LoggerFactory";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import IdGenerator from "util/IdGenerator";
import DomWalker from "component/DomWalker";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import { Properties } from "properties/Property";

class ServicesImpl implements Services {

	private dom: Dom;

	private factories: Factories;

	private lf: LoggerFactory;

	private idg: IdGenerator;

	private behaviorsRegistry:  BehaviorsRegistry;

	private domWalker: DomWalker<any>;

	constructor(dom: Dom, properties: Properties) {
		this.dom = requireNotNull(dom, "dom");
		this.lf = new LoggerFactoryImpl(properties);
		this.idg = new IdGenerator();
		this.factories = new FactoriesImpl(this);
		this.behaviorsRegistry = new BehaviorsRegistryImpl();
		this.domWalker = new MvvmDomWalkerImpl(this);
	}

	public getDomWalker(): DomWalker<any> {
		return this.domWalker;
	}

	public getDom(): Dom {
		return this.dom;
	}

	public getFactories(): Factories {
		return this.factories;
	}

	public logFactory(): LoggerFactory {
		return this.lf;
	}

	public idGenerator(): IdGenerator {
		return this.idg;
	}

	public getBehaviorsRegistry(): BehaviorsRegistry {
		return this.behaviorsRegistry;
	}

}

export default ServicesImpl;
