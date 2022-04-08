import { Bundle } from "i18n/Bundle";
import AbstractBundleResolver from "i18n/AbstractBundleResolver";
import SimpleMap from "interface/SimpleMap";

class CydranBaseBundleResolver extends AbstractBundleResolver {
	private rezBundles: SimpleMap<Bundle>;

	constructor() {
		super();
		this.rezBundles = {};
		this.resolve({ force: true });
	}

	public resolve(opts = { force: false }): void {
		if(!!this.rezBundles[this.activeLocale()] || opts.force) {
			const rezPath: string = `./bundles/${ this.activeLocale() }.json`;
			this.rezBundles[this.activeLocale()] = require(rezPath);
		}
	}

	public msg(key: string, alt = "n/a"): string {
		return key || alt;
	}
}

export default CydranBaseBundleResolver;
