import SimpleMap from "interface/SimpleMap";
import BundleFactory from "i18n/BundleFactory";
import BundleResolver from "i18n/BundleResolver";
import I18nContext from "i18n/I18nContext";
import CydranBaseBundleResolver from "./CydranBaseBundleResolver";
import { CYDRAN_KEY, DEFAULT_LOCALE, DEFAULT_MODULE_KEY } from "const/HardValues";
import { I18nError } from "error/Errors";
import { isDefined } from "util/Utils";

const subKeyRegEx: RegExp = /\{(\d+)\}/g;
const minLen: number = 3 as const;

class BundleFactoryImpl implements BundleFactory {
	private preferredLoc: string;
	private resolvers: SimpleMap<BundleResolver>;

	constructor() {
		this.resolvers = {};
		this.resolvers[CYDRAN_KEY] = new CydranBaseBundleResolver();
	}

	public registerResolver(key: string, resolver: BundleResolver): void {
		const wkKey: string = key.toLowerCase().trim();
		if(wkKey !== CYDRAN_KEY) {
			this.resolvers[wkKey] = resolver;
		}
	}

	public removeResolver(key: string): void {
		const wkKey: string = key.toLowerCase().trim();
		if(wkKey === CYDRAN_KEY) {
			throw new I18nError(`Not allowed to remove the "${CYDRAN_KEY}" bundle resolver.`);
		}
		if(this.resolvers[wkKey]) {
			delete this.resolvers[wkKey];
		}
	}

	public setPreferredLocale(locale: string): void {
		const wkLoc: string = locale.toLowerCase().trim();
		this.preferredLoc = (wkLoc === DEFAULT_LOCALE) ? null: wkLoc;
		Object.keys(this.resolvers).forEach((k: string) => {
			const wkRezolvr: BundleResolver = this.resolvers[k];
			wkRezolvr.setPreferredLocale(this.preferredLoc);
		});
	}

	public msg(context: string, category: string, group: string, item: string, subs: string[] = [], alt: string = ""): string {
		const wkLoc: string = isDefined(this.resolvers[this.preferredLoc]) ? this.preferredLoc : DEFAULT_LOCALE;
		const result: string = this.resolvers[wkLoc]?.msg(context, category, group, item, subs) || alt;
		return this.subValues(result, subs);
	}

	public msgFromContext(i18nCtxt: I18nContext, subs: string[] = [], alt?: string) {
		//
	}

	private subValues(base: string, subs: string[]): string {
		let result: string = base;
		if(base.length > minLen) {
			let reSegs: string[] = null;
			while(isDefined(reSegs = subKeyRegEx.exec(result))) {
				result = result.replace(reSegs[0], subs[reSegs[1]] || 'n/a');
			}
		}
		return result;
	}
}

export default BundleFactoryImpl;
