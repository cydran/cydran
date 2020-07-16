const INTERNAL_DIRECT_CHANNEL_NAME: string = "Cydran$$Direct$$Internal$$Channel";
const COMMENT_NODE_TYPE: number = 8;
const ELEMENT_NODE_TYPE: number = 1;
const TEXT_NODE_TYPE: number = 3;
const MODULE_FIELD_NAME: string = "____internal$$cydran$$module____";
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel";
const DEFAULT_MODULE_KEY: string = "DEFAULT";
const ANONYMOUS_REGION_PREFIX: string = "%%%Region_";
const CYDRAN_SCRIPT_PREFIX: string = "cydran/";
const DEFAULT_CLONE_DEPTH: number = 50;
const DEFAULT_EQUALS_DEPTH: number = 50;
const CYDRAN_KEY: string = "cydran";

function NO_OP_FN() {
	// Intentionally do nothing
}

function EMPTY_OBJECT_FN() {
	return {};
}

export {
	DEFAULT_MODULE_KEY,
	INTERNAL_DIRECT_CHANNEL_NAME,
	INTERNAL_CHANNEL_NAME,
	MODULE_FIELD_NAME,
	TEXT_NODE_TYPE,
	COMMENT_NODE_TYPE,
	ELEMENT_NODE_TYPE,
	NO_OP_FN,
	EMPTY_OBJECT_FN,
	ANONYMOUS_REGION_PREFIX,
	DEFAULT_CLONE_DEPTH,
	DEFAULT_EQUALS_DEPTH,
	CYDRAN_SCRIPT_PREFIX,
	CYDRAN_KEY
};
