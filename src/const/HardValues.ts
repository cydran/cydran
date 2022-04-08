const CYDRAN_PUBLIC_CHANNEL: string = "Cydran$$Public$$Channel" as const;
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel" as const;
const MODULE_FIELD_NAME: string = "____internal$$cydran$$module____" as const;
const DEFAULT_MODULE_KEY: string = "DEFAULT" as const;
const DEFAULT_LOG_STRATEGY: string = "default" as const;
const DEFAULT_PREFIX: string = "c" as const;
const ATTRIBUTE_DELIMITER: string = "-" as const;
const ANONYMOUS_REGION_PREFIX: string = "%%%Region_" as const;
const CYDRAN_KEY: string = "cydran" as const;
const CYDRAN_DISPOSE_FN_NAME = "$dispose" as const;
const CYDRAN_SCRIPT_PREFIX: string = `${CYDRAN_KEY}/` as const;
const DEFAULT_CLONE_DEPTH: number = 50 as const;
const DEFAULT_EQUALS_DEPTH: number = 50 as const;
const DOM_KEY: string = "dom" as const;
const CHANGE_KEY: string = "change" as const;
const INPUT_KEY: string = "input" as const;
const RESET_KEY: string = "reset" as const;
const VALID_ID: RegExp = /^[a-zA-Z][a-zA-Z\d\$\@\-\_\.\:\\\/]*$/m;
const VALID_KEY: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z\d\$\_]*$/);
const BEHAVIOR_FORM_RESET: string = "cydran:behavior:form:reset";

export {
	CYDRAN_PUBLIC_CHANNEL,
	BEHAVIOR_FORM_RESET,
	MODULE_FIELD_NAME,
	INTERNAL_CHANNEL_NAME,
	DEFAULT_MODULE_KEY,
	DEFAULT_LOG_STRATEGY,
	DEFAULT_PREFIX,
	ATTRIBUTE_DELIMITER,
	ANONYMOUS_REGION_PREFIX,
	CYDRAN_SCRIPT_PREFIX,
	DEFAULT_CLONE_DEPTH,
	DEFAULT_EQUALS_DEPTH,
	CYDRAN_KEY,
	CYDRAN_DISPOSE_FN_NAME,
	DOM_KEY,
	CHANGE_KEY,
	INPUT_KEY,
	RESET_KEY,
	VALID_ID,
	VALID_KEY
};
