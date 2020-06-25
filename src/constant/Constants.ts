const INTERNAL_DIRECT_CHANNEL_NAME: string = "Cydran$$Direct$$Internal$$Channel";
const TEXT_NODE_TYPE: number = 3;
const MODULE_FIELD_NAME: string = "____internal$$cydran$$module____";
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel";
const COMPONENT_INTERNALS_FIELD_NAME: string = "____internal$$cydran____";
const DEFAULT_MODULE_KEY: string = "DEFAULT";
const ANONYMOUS_REGION_PREFIX: string = "%%%Region_";

function NO_OP_FN() {
	// Intentionally do nothing
}

function EMPTY_OBJECT_FN() {
	return {};
}

export {
	COMPONENT_INTERNALS_FIELD_NAME,
	DEFAULT_MODULE_KEY,
	INTERNAL_DIRECT_CHANNEL_NAME,
	INTERNAL_CHANNEL_NAME,
	MODULE_FIELD_NAME,
	TEXT_NODE_TYPE,
	NO_OP_FN,
	EMPTY_OBJECT_FN,
	ANONYMOUS_REGION_PREFIX
};
