import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import BehaviorsRegistryImpl from "behavior/BehaviorsRegistryImpl";
import CydranContext from "context/CydranContext";
import Dom from "dom/Dom";
import Factories from "factory/Factories";
import FactoriesImpl from "factory/FactoriesImpl";
import { hasContents, requireNotNull } from 'util/Utils';
import LoggerFactory from "log/LoggerFactory";
import SimpleMap from "interface/SimpleMap";
import PropertiesImpl from "properties/PropertiesImpl";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import IdGenerator from "util/IdGenerator";
import PropertyKeys from "const/PropertyKeys";
import I18nContext from "i18n/I18nContext";
import I18nResolvable from "interface/ables/I18nResolvable";
import BundleFactory from "i18n/BundleFactory";
import BundleFactoryImpl from "i18n/BundleFactoryImpl";
import I18nContextImpl from "i18n/I18nContextImpl";

class CydranContextImpl implements CydranContext, I18nResolvable {

	private dom: Dom;

	private factories: Factories;

	private lf: LoggerFactory;

	private idg: IdGenerator;

	private behaviorsRegistry:  BehaviorsRegistry;

	private bf: BundleFactory;

	private instanceAppId: string;

	private i18nCtxt: I18nContext;

	constructor(dom: Dom, properties: SimpleMap<any> = {}) {
		this.dom = requireNotNull(dom, "dom");
		this.idg = new IdGenerator();
		this.bf = new BundleFactoryImpl();
		const wkProps: PropertiesImpl = new PropertiesImpl();
		wkProps.load(properties);
		const tmpAppId: string = wkProps.getAsString(PropertyKeys.INSTANCE_APP_ID);
		this.instanceAppId =  hasContents(tmpAppId) ? tmpAppId : `app-${this.idg.generate()}`;
		this.i18nCtxt = new I18nContextImpl(this.instanceAppId);
		this.lf = new LoggerFactoryImpl(wkProps);
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

	public i18nContext(): I18nContext {
		return this.i18nCtxt;
	}

	public bundleFactory(): BundleFactory {
		return this.bf;
	}

}

export default CydranContextImpl;
