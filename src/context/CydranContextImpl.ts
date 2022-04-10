import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import BehaviorsRegistryImpl from "behavior/BehaviorsRegistryImpl";
import CydranContext from "context/CydranContext";
import Dom from "dom/Dom";
import Factories from "factory/Factories";
import FactoriesImpl from "factory/FactoriesImpl";
import { requireNotNull } from 'util/Utils';
import LoggerFactory from "log/LoggerFactory";
import SimpleMap from "interface/SimpleMap";
import PropertiesImpl from "properties/PropertiesImpl";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import IdGenerator from "util/IdGenerator";
import I18nResolvable from "interface/ables/I18nResolvable";

class CydranContextImpl implements CydranContext {

	private dom: Dom;

	private factories: Factories;

	private lf: LoggerFactory;

	private idg: IdGenerator;

	private behaviorsRegistry:  BehaviorsRegistry;

	private bf: BundleFactory;

	private i18nCtxt: I18nContext;
	constructor(dom: Dom, properties: SimpleMap<any> = {}) {
		this.dom = requireNotNull(dom, "dom");
		this.bf = new BundleFactoryImpl();
		const wkProps: PropertiesImpl = new PropertiesImpl();
		wkProps.load(properties);
		this.i18nCtxt = new I18nContextImpl(this.instanceAppId);
		this.lf = new LoggerFactoryImpl(wkProps);
		this.idg = new IdGenerator();
		this.factories = new FactoriesImpl(this);
		this.behaviorsRegistry = new BehaviorsRegistryImpl();
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

	public i18nContext(): I18nContext {
		return this.i18nCtxt;
	}

	public bundleFactory(): BundleFactory {
		return this.bf;
	}

}

export default CydranContextImpl;
