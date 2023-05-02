import BundleResolver from "i18n/BundleResolver";

interface BundleFactory {

	setPreferredLocale(loc: string): void;

	registerResolver(key: string, resolver: BundleResolver): void;

	removeResolver(key: string): void;

	injectI18nFnIn(contextObj: any, bscope: BundleScope): void;
}

enum BundleScope {
	CTX,
	CAT,
	GRP,
	ITM
}

export { BundleScope, BundleFactory };
