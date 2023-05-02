import { Bundle } from "i18n/Bundle";
import { ResolveOptions, AbstractBundleResolver } from "i18n/AbstractBundleResolver";
import SimpleMap from "interface/SimpleMap";
import Logger from "log/Logger";

class DefaultAppBundleResolver extends AbstractBundleResolver {
	private rezBundles: SimpleMap<Bundle>;
	private logger: Logger;

	constructor(doResolve: boolean = true, logger: Logger) {
		super();
		this.logger = logger;
		this.rezBundles = {};
		this.resolve({ enabled: false });
	}

	public resolve(opts: ResolveOptions): void {
		if(opts.enabled && !!this.rezBundles[this.activeLocale()]) {
			const rezPath: string = opts.url || `bundles/${ this.activeLocale() }.json`;
			try {
				this.retrieve(rezPath, (data: string) => {
					const wkData: Bundle = JSON.parse(data);
					this.rezBundles[this.activeLocale()] = wkData;
					this.logger.ifDebug(() => `bundle resolved: ${rezPath}`);
				}, "GET");
			} catch (err) {
				this.logger.ifError(() => `bundle retrieval issue: ${rezPath}`, err);
			}
		}
	}

	public msg(context: string, category: string, group: string, key: string, subs: string[], alt: string = "n/a"): string {
		return key || alt;
	}
}

export default DefaultAppBundleResolver;
