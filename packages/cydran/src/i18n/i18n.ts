import SimpleMap from "interface/SimpleMap";
import { isDefined, orNull, requireNotNull } from 'util/Utils';

// TODO - Review this code and bring it into alignment with industry accepted terminology for i18n concepts

interface Bundle  extends SimpleMap<Domain> {
	// Intentionally empty
}

interface Domain  extends SimpleMap<Section> {
	// Intentionally empty
}

interface Section  extends SimpleMap<Group> {
	// Intentionally empty
}

interface Group extends SimpleMap<string> {
	// Intentionally empty
}

const bundles: SimpleMap<Bundle> = {
	"en-us": {
		"cydran": {
			"messages": {
				"errors": {
					"00001": "Something went really wrong"
				}
			}
		}
	}
};

const DEFAULT_LOCALE: string = "en-us";

interface Navigator {

	languages: string[];

}

function getLocale(): string {
	return isDefined(navigator) && isDefined(navigator.languages[0] && navigator.languages.length > 0) ? navigator.languages[0].toLowerCase() : DEFAULT_LOCALE;
}

function lookupForLocale(locale: string, domain: string, section: string, group: string, key: string): string {
	requireNotNull(locale, "locale");
	requireNotNull(domain, "domain");
	requireNotNull(section, "section");
	requireNotNull(group, "group");
	requireNotNull(key, "key");

	const result: string = bundles?.[locale]?.[domain]?.[section]?.[group]?.[key];

	return result;
}

function lookup(locale: string, domain: string, section: string, group: string, key: string): string {
	const prefered: string = lookupForLocale(locale, domain, section, group, key);
	const result: string = isDefined(prefered) ? prefered : lookupForLocale(DEFAULT_LOCALE, domain, section, group, key);

	return result;
}

function composite(template: string, params: unknown): string {

	// TODO - Implement

	return template;
}

function i18n(domain: string, section: string, group: string, key: string, params?: unknown): string {
	const locale = getLocale();
	const text = lookup(locale, domain, section, group, key);
	const result = isDefined(params) ? composite(text, params) : text;

	return result;
}

export default i18n;
