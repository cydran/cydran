import I18nContext from "i18n/I18nContext";

interface I18nResolvable {

	/**
	 * Get the i18n cydran context
	 * @returns context for i18n resolution
	 */
	 i18nContext(): I18nContext;

}

export default I18nResolvable;
