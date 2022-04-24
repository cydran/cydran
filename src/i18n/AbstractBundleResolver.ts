import BundleResolver from "i18n/BundleResolver";
import { DEFAULT_LOCALE } from "const/HardValues";
import { isDefined } from "util/Utils";

const getArgs = (func) => {
	const args: string = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
	return args.split(",").map((arg: string) => {
		return arg.replace(/\/\*.*\*\//, "").trim();
	}).filter((arg: string) => {
		return arg;
	}).reverse();
};

const curryFn = (fn: Function) => {
	const argNames: string[] = getArgs(fn).reverse();
	let wkFn: string = `return f(${argNames})`;
	getArgs(fn).forEach((a) => {
		wkFn = `return (${a}) => {${wkFn}}`;
	});
	wkFn = `(f) => {${wkFn}}`;
	// tslint:disable-next-line
	return eval(wkFn);
};

abstract class AbstractBundleResolver implements BundleResolver {
	private static readonly DEF_LOC: string = DEFAULT_LOCALE;
	private preferredLoc: string;

	public setPreferredLocale(locale: string = null): void {
		const wkLoc: string = (isDefined(locale)) ? locale : navigator.language.toLowerCase();
		this.preferredLoc = (wkLoc !== AbstractBundleResolver.DEF_LOC) ? wkLoc : null;
	}

	public activeLocale(): string {
		return this.preferredLoc || AbstractBundleResolver.DEF_LOC;
	}

	abstract msg(context: string, category: string, group: string, key: string, subs?: string[], alt?: string): string;

	abstract resolve(opts: {}): void;
}

export default AbstractBundleResolver;
