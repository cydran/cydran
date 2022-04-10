import BundleResolver from "i18n/BundleResolver";

interface BundleFactory {

	setPreferredLocale(loc: string): void;

	registerResolver(key: string, resolver: BundleResolver): void;

	removeResolver(key: string): void;

	/**
	 * Get a message/text from an associate bundle
	 * @param context -
	 * @param category -
	 * @param group -
	 * @param item - string following dot notation of "<context>.<category>.<item>"
	 * @param subs - substitution values by position
	 * @param alt - value to utilize if key value not available
	 * @returns
	 * ```
	 * example: cydran.error.00001
	 * ```
	 */
	 msg(context: string, category: string, group: string, item: string, subs?: string[], alt?: string): string;
}

export default BundleFactory;
