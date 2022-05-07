import BundleResolver from "i18n/BundleResolver";

interface BundleFactory {

	setPreferredLocale(loc: string): void;

	registerResolver(key: string, resolver: BundleResolver): void;

	removeResolver(key: string): void;
}

export default BundleFactory;
