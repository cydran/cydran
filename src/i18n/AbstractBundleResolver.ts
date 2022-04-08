import BundleResolver from "i18n/BundleResolver";
import { DEFAULT_LOCALE } from "const/HardValues";


abstract class AbstractBundleResolver implements BundleResolver {
	private static readonly DEF_LOC: string = DEFAULT_LOCALE;
	private preferredLoc: string;

	public setPreferredLocale(locale: string): void {
		this.preferredLoc = locale;
	}

	public activeLocale(): string {
		return this.preferredLoc || AbstractBundleResolver.DEF_LOC;
	}

	abstract msg(key: string, alt?: string): string;

	abstract resolve(opts: {}): void;
}

export default AbstractBundleResolver;
