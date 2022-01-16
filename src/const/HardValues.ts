const CYDRAN_PUBLIC_CHANNEL: string = "Cydran$$Public$$Channel";
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel";
const MODULE_FIELD_NAME: string = "____internal$$cydran$$module____";
const DEFAULT_MODULE_KEY: string = "DEFAULT";
const DEFAULT_PREFIX: string = "c";
const ATTRIBUTE_DELIMITER: string = "-";
const ANONYMOUS_REGION_PREFIX: string = "%%%Region_";
const CYDRAN_KEY: string = "cydran";
const CYDRAN_SCRIPT_PREFIX: string = `${ CYDRAN_KEY }/`;
const DEFAULT_CLONE_DEPTH: number = 50;
const DEFAULT_EQUALS_DEPTH: number = 50;
const DOM_KEY: string = "dom";
const INPUT_KEY: string = "input";
const VALID_ID: RegExp = /^[a-zA-Z][a-zA-Z\d\$\@\-\_\.\:\\\/]*$/m;
const VALID_KEY: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z\d\$\_]*$/);

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
	VALID_ID,
	VALID_KEY
};
