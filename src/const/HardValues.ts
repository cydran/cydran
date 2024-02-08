const ANONYMOUS_REGION_PREFIX: string = "%%%Region_" as const;
const ATTRIBUTE_DELIMITER: string = "-" as const;
const BEHAVIOR_FORM_RESET: string = "cydran:behavior:form:reset" as const;
const CHANGE_KEY: string = "change" as const;
const CYDRAN_DISPOSE_FN_NAME = "$dispose" as const;
const CYDRAN_KEY: string = "cydran" as const;
const CYDRAN_PUBLIC_CHANNEL: string = "Cydran$$Public$$Channel" as const;
const CYDRAN_SCRIPT_PREFIX: string = `${ CYDRAN_KEY }/` as const;
const DEFAULT_CLONE_DEPTH: number = 50 as const;
const DEFAULT_CONTEXT_KEY: string = "DEFAULT" as const;
const DEFAULT_EQUALS_DEPTH: number = 50 as const;
const DEFAULT_LOG_STRATEGY: string = "default" as const;
const DEFAULT_PREFIX: string = "c" as const;
const DOM_KEY: string = "dom" as const;
const INPUT_KEY: string = "input" as const;
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel" as const;
const RESET_KEY: string = "reset" as const;
const VALID_ID: RegExp = /^[^\/\.]+$/m;
const VALID_KEY: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z\d\$\_\*]*$/);
const LOCAL_ID_REGEX: RegExp = /^[^\/]+$/;
const RELATIVE_PATH_REGEX: RegExp = /^([a-zA-Z0-9]+|\.\.|\.)(\/([a-zA-Z0-9]+|\.\.|\.))*\/[^\/]+$/;
const LITERAL_PATH_REGEX: RegExp = /^(\/([a-zA-Z0-9]+|\.\.|\.))*\/[^\/]+$/;

export {
	ANONYMOUS_REGION_PREFIX,
	ATTRIBUTE_DELIMITER,
	BEHAVIOR_FORM_RESET,
	CHANGE_KEY,
	CYDRAN_DISPOSE_FN_NAME,
	CYDRAN_KEY,
	CYDRAN_PUBLIC_CHANNEL,
	CYDRAN_SCRIPT_PREFIX,
	DEFAULT_CLONE_DEPTH,
	DEFAULT_CONTEXT_KEY,
	DEFAULT_EQUALS_DEPTH,
	DEFAULT_LOG_STRATEGY,
	DEFAULT_PREFIX,
	DOM_KEY,
	INPUT_KEY,
	INTERNAL_CHANNEL_NAME,
	RESET_KEY,
	VALID_ID,
	VALID_KEY,
	LOCAL_ID_REGEX,
	RELATIVE_PATH_REGEX,
	LITERAL_PATH_REGEX
};
