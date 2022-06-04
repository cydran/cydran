import BundleResolver from "i18n/BundleResolver";
import { DEFAULT_LOCALE } from "const/HardValues";
import { isDefined } from "util/Utils";
import SimpleHttpClientImpl from "http/SimpleHttpClientImpl";
import ResourceRetriever from "interface/ResourceRetriever";

type ResolveOptions = { enabled: boolean, url?: string, bundleId?: string };
abstract class AbstractBundleResolver implements BundleResolver {
	private static readonly DEF_LOC: string = DEFAULT_LOCALE;
	private retriever: ResourceRetriever;
	private preferredLoc: string;

	constructor(retriever: ResourceRetriever = new SimpleHttpClientImpl()) {
		this.retriever = retriever;
	}

	public setPreferredLocale(locale: string = null): void {
		const wkLoc: string = (isDefined(locale)) ? locale : navigator.language.toLowerCase();
		this.preferredLoc = (wkLoc !== AbstractBundleResolver.DEF_LOC) ? wkLoc : null;
	}

	public activeLocale(): string {
		return this.preferredLoc || AbstractBundleResolver.DEF_LOC;
	}

	protected retrieve(url: string, callback: Function, method?: string) {
		this.retriever.resource(url, callback, method);
	}

	abstract msg(context: string, category: string, group: string, key: string, subs?: string[], alt?: string): string;

	abstract resolve(opts: {}): void;
}

export { ResolveOptions, AbstractBundleResolver };
