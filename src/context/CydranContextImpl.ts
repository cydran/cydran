import CydranContext from "context/CydranContext";
import Dom from "dom/Dom";
import Factories from "factory/Factories";
import FactoriesImpl from "factory/FactoriesImpl";
import { requireNotNull } from 'util/Utils';
import LoggerFactory from "log/LoggerFactory";
import SimpleMap from "interface/SimpleMap";
import PropertiesImpl from "properties/PropertiesImpl";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";

class CydranContextImpl implements CydranContext {

	private dom: Dom;

	private factories: Factories;

	private lf: LoggerFactory;

	constructor(dom: Dom, properties: SimpleMap<any> = {}) {
		this.dom = requireNotNull(dom, "dom");
		const wkProps: PropertiesImpl = new PropertiesImpl();
		wkProps.load(properties);
		this.lf = new LoggerFactoryImpl(wkProps);
		this.factories = new FactoriesImpl(this);
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

}

export default CydranContextImpl;
