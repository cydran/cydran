const CYDRAN_PUBLIC_CHANNEL: string = "Cydran$$Public$$Channel";
const MODULE_FIELD_NAME: string = "____internal$$cydran$$module____";
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel";
const DEFAULT_MODULE_KEY: string = "DEFAULT";
const DEFAULT_PREFIX: string = "c";
const ATTRIBUTE_DELIMITER: string = ":";
const ANONYMOUS_REGION_PREFIX: string = "%%%Region_";
const CYDRAN_SCRIPT_PREFIX: string = "cydran/";
const DEFAULT_CLONE_DEPTH: number = 50;
const DEFAULT_EQUALS_DEPTH: number = 50;
const CYDRAN_KEY: string = "cydran";
const DOM_KEY: string = "dom";
const INPUT_KEY: string = "input";
const STRING_TYPE: string = "string";
const NESTING_CHANGED: string = "NESTING_CHANGED";
const VALID_ID: RegExp = /^[a-zA-Z][a-zA-Z0-9\$\@\-\_\.\:\\\/]*$/m;
const VALID_KEY: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z0-9\$\_]*$/);

export {
	CYDRAN_PUBLIC_CHANNEL,
	MODULE_FIELD_NAME,
	INTERNAL_CHANNEL_NAME,
	DEFAULT_MODULE_KEY,
	DEFAULT_PREFIX,
	ATTRIBUTE_DELIMITER,
	ANONYMOUS_REGION_PREFIX,
	CYDRAN_SCRIPT_PREFIX,
	DEFAULT_CLONE_DEPTH,
	DEFAULT_EQUALS_DEPTH,
	CYDRAN_KEY,
	DOM_KEY,
	INPUT_KEY,
	STRING_TYPE,
	NESTING_CHANGED,
	VALID_ID,
	VALID_KEY
};