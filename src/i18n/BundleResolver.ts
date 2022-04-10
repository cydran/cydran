import MsgContextResolverProvider from "i18n/I18nContext";

interface BundleResolver {
	/**
	 * Resolve the appropriate resource bundle to use.  If a preferred locale is not specified with {@link #setPreferredLocale} then "en-us" will be used as the default
	 * @param options - optional behavior flags for resolution
	 */
	resolve(options?: {}): void;

	/**
	 * Set the preferred lcoale to use for language resolution
	 * @param locale - locale code
	 */
	setPreferredLocale(locale: string): void;

	/**
	 * Get the active locale of the language resolution
	 * @returns - string representation of the active locale, i.e.: "en-us"
	 */
	activeLocale(): string;

	/**
	 * Get a message/text from an associate bundle
	 * @param context -
	 * @param category -
	 * @param group -
	 * @param key - string following dot notation of "<context>.<category>.<item>"
	 * @param subs - substitution values by position
	 * @returns
	 * ```
	 * example: cydran.error.00001
	 * ```
	 */
	msg(context: string, category: string, group: string, key: string, subs?: string[]): string;
}

export default BundleResolver;
