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
import PropertyKeys from "const/PropertyKeys";
import { BundleFactory } from "i18n/BundleFactory";
import BundleFactoryImpl from "i18n/BundleFactoryImpl";

class CydranContextImpl implements CydranContext {

	private dom: Dom;

	private factories: Factories;

	private lf: LoggerFactory;

	private idg: IdGenerator;

	private behaviorsRegistry:  BehaviorsRegistry;

	private bf: BundleFactory;

	private instanceAppId: string;

	constructor(dom: Dom, properties: SimpleMap<any> = {}) {
		this.dom = requireNotNull(dom, "dom");
		this.idg = new IdGenerator();
		const wkProps: PropertiesImpl = new PropertiesImpl();
		wkProps.load(properties);
		this.instanceAppId = wkProps.getAsString(PropertyKeys.INSTANCE_APP_ID);
		this.lf = new LoggerFactoryImpl(wkProps);
		const cydranI18n: boolean = wkProps.get(PropertyKeys.CYDRAN_I18N_ENABLED);
		this.bf = new BundleFactoryImpl(cydranI18n, this.lf);
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

	public getName(): string {
		return this.instanceAppId;
	}

	public bundleFactory(): BundleFactory {
		return this.bf;
	}

}

export default CydranContextImpl;
