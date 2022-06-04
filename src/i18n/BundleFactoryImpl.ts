import SimpleMap from "interface/SimpleMap";
import { BundleFactory, BundleScope } from "i18n/BundleFactory";
import BundleResolver from "i18n/BundleResolver";
import CydranBaseBundleResolver from "i18n/CydranBaseBundleResolver";
import DefaultAppBundleResolver from "i18n/DefaultAppBundleResolver";
import { CYDRAN_KEY, DEFAULT_LOCALE, DEFAULT_MODULE_KEY, DEFAULT_APP_ID } from "const/HardValues";
import { I18nError } from "error/Errors";
import { isDefined } from "util/Utils";
import LoggerFactory from "log/LoggerFactory";
import Logger from "log/Logger";

const MARKER: RegExp = /\{([1-9]\d*|[0]{1})?\}/g;

class BundleFactoryImpl implements BundleFactory {
	private preferredLoc: string;
	private resolvers: SimpleMap<BundleResolver>;
	private logger: Logger;

	constructor(cI18nEnabled: boolean, lf: LoggerFactory) {
		this.resolvers = {};
		this.logger = lf.getLogger("BundleFactory");
		this.resolvers[CYDRAN_KEY] = new CydranBaseBundleResolver(cI18nEnabled, lf.getLogger(CydranBaseBundleResolver.name));
		this.resolvers[DEFAULT_APP_ID] = new DefaultAppBundleResolver(cI18nEnabled, lf.getLogger(DefaultAppBundleResolver.name));
	}

	public registerResolver(key: string, resolver: BundleResolver): void {
		const wkKey: string = key.toLowerCase().trim();
		if(wkKey !== CYDRAN_KEY) {
			this.resolvers[wkKey] = resolver;
			this.logger.ifDebug(() => `bundle resolver registered: ${key}`);
		} else {
			this.logger.ifWarn(() => `invalid attempt to replace immutable bundle: ${key}`);
		}
	}

	public removeResolver(key: string): void {
		const wkKey: string = key.toLowerCase().trim();
		if(wkKey === CYDRAN_KEY) {
			throw new I18nError(`Not allowed to remove the "${CYDRAN_KEY}" bundle resolver.`);
		}
		if(this.resolvers[wkKey]) {
			delete this.resolvers[wkKey];
			this.logger.ifDebug(() => `bundle resolver removed: ${ wkKey }`);
		}
	}

	public setPreferredLocale(locale: string): void {
		const wkLoc: string = locale.toLowerCase().trim();
		this.preferredLoc = (wkLoc === DEFAULT_LOCALE) ? null: wkLoc;
		Object.keys(this.resolvers).forEach((k: string) => {
			const wkRezolvr: BundleResolver = this.resolvers[k];
			wkRezolvr.setPreferredLocale(this.preferredLoc);
		});
		this.logger.ifDebug(() => `preferred locale set: ${ this.preferredLoc }`);
	}

	public injectI18nFnIn(contextObj: any, bscope: BundleScope): void {
		const msgFn: Function = (): Function => {
			let result;
			switch(bscope) {
				case BundleScope.CTX:
				case BundleScope.CAT:
				case BundleScope.GRP:
				case BundleScope.ITM:
				default:
					result = (val: string) => { return val; };
					break;
			}
			return result;
		};
		contextObj["msg"] = msgFn;
	}

	private msg(context: string = CYDRAN_KEY, category: string = DEFAULT_MODULE_KEY, group: string, item: string, subs: string[] = [], alt: string = ""): string {
		const wkLoc: string = isDefined(this.resolvers[this.preferredLoc]) ? this.preferredLoc : DEFAULT_LOCALE;
		const result: string = this.resolvers[wkLoc]?.msg(context, category, group, item, subs) || alt;
		return this.substituteValues(result, subs);
	}

	private substituteValues(base: string, values: string[]): string {
		const result: string = base.replace(MARKER, (key: string) => {
			const index: number = Math.abs(Number(key.slice(1, -1)));
			return (index >= values.length) ? null : values[index];
		});
		return result;
	}
}

export default BundleFactoryImpl;
