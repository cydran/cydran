import SimpleMap from "interface/SimpleMap";
import { Bundle } from "i18n/Bundle";
import BundleFactory from "i18n/BundleFactory";
import BundleResolver from "i18n/BundleResolver";
import { requireNotNull } from "util/Utils";
import CydranBaseBundleResolver from "./CydranBaseBundleResolver";
import { CYDRAN_KEY, DEFAULT_LOCALE } from "const/HardValues";
import { I18nError } from "error/Errors";

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
		if(locale.toLowerCase().trim() === DEFAULT_LOCALE) {
			this.preferredLoc = null;
		}
		Object.keys(this.resolvers).forEach((k: string) => {
			const wkRezolvr: BundleResolver = this.resolvers[k];
			wkRezolvr.setPreferredLocale(this.preferredLoc);
		});
	}

	public msg(key: string): string {
		const toks: string[] = requireNotNull(key, "key").split(".");
		return (toks.length === 3) ? toks[toks.length - 1] : "";
	}

}

export default BundleFactoryImpl;
