import BundleResolver from "i18n/BundleResolver";
import { DEFAULT_LOCALE } from "const/HardValues";
import { isDefined } from "util/Utils";


abstract class AbstractBundleResolver implements BundleResolver {
	private static readonly DEF_LOC: string = DEFAULT_LOCALE;
	private preferredLoc: string;

	public setPreferredLocale(locale?: string): void {
		this.preferredLoc = isDefined(navigator) && isDefined(navigator.languages[0] && navigator.languages.length > 0) ? navigator.languages[0].toLowerCase() : null;
		if(isDefined(locale)) {
			this.preferredLoc = locale;
		}
	}

	public activeLocale(): string {
		return this.preferredLoc || AbstractBundleResolver.DEF_LOC;
	}

	abstract msg(context: string, category: string, group: string, key: string, subs?: string[], alt?: string): string;

	abstract resolve(opts: {}): void;
}

export default AbstractBundleResolver;
