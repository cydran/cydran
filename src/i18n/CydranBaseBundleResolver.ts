import { Bundle } from "i18n/Bundle";
import AbstractBundleResolver from "i18n/AbstractBundleResolver";
import SimpleMap from "interface/SimpleMap";

class CydranBaseBundleResolver extends AbstractBundleResolver {
	private rezBundles: SimpleMap<Bundle>;

	constructor() {
		super();
		this.rezBundles = {};
		this.resolve({ force: false });
	}

	public resolve(opts = { force: false }): void {
		if(false) {
			if(!!this.rezBundles[this.activeLocale()] || opts.force) {
				const rezPath: string = `bundles/${ this.activeLocale() }.json`;
				this.rezBundles[this.activeLocale()] = require(rezPath);
			}
		}
	}

	public msg(context: string, category: string, group: string, key: string, subs: string[], alt: string = "n/a"): string {
		return key || alt;
	}
}

export default CydranBaseBundleResolver;
