import BundleResolver from "./BundleResolver";

interface BundleFactory {

	setPreferredLocale(loc: string): void;

	registerResolver(key: string, resolver: BundleResolver): void;

	removeResolver(key: string): void;

	msg(key: string): string;
}

export default BundleFactory;
