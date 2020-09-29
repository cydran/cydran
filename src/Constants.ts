const INTERNAL_DIRECT_CHANNEL_NAME: string = "Cydran$$Direct$$Internal$$Channel";
const CYDRAN_PUBLIC_CHANNEL: string = "Cydran$$Public$$Channel";
const MODULE_FIELD_NAME: string = "____internal$$cydran$$module____";
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel";
const DEFAULT_MODULE_KEY: string = "DEFAULT";
const ANONYMOUS_REGION_PREFIX: string = "%%%Region_";
const CYDRAN_SCRIPT_PREFIX: string = "cydran/";
const DEFAULT_CLONE_DEPTH: number = 50;
const DEFAULT_EQUALS_DEPTH: number = 50;
const CYDRAN_KEY: string = "cydran";
const DOM_KEY = "dom";
const INPUT_KEY = "input";
const STRING_TYPE = "string";
const NESTING_CHANGED: string = "NESTING_CHANGED";
const VALID_ID: RegExp = /^[a-zA-Z][a-zA-Z0-9\$\@\-\_\.\:\\\/]*$/m;
const VALID_KEY: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z0-9\$\_]*$/);

function NO_OP_FN() {
	// Intentionally do nothing
}

function EMPTY_OBJECT_FN() {
	return {};
}

interface NodeTypesFields {
	COMMENT: number;
	ELEMENT: number;
	TEXT: number;
}

const NodeTypes: NodeTypesFields = {
	COMMENT: 8,
	ELEMENT: 1,
	TEXT: 3
};

interface AttrsFields {
	ID: string;
	NAME: string;
	COMPONENT: string;
	MODULE: string;
	VALUE: string;
	LOCK: string;
}

const Attrs: AttrsFields = {
	ID: "id",
	NAME: "name",
	COMPONENT: "component",
	MODULE: "module",
	VALUE: "value",
	LOCK: "lock"
};

interface PropertyKeysFields {
	CYDRAN_DIGEST_MAX_EVALUATIONS: string;
	CYDRAN_CLONE_MAX_EVALUATIONS: string;
	CYDRAN_EQUALS_MAX_EVALUATIONS: string;
	CYDRAN_PRODUCTION_ENABLED: string;
}

const PropertyKeys: PropertyKeysFields = {
	CYDRAN_DIGEST_MAX_EVALUATIONS: "cydran.digest.maxEvaluations",
	CYDRAN_CLONE_MAX_EVALUATIONS: "cydran.clone.maxEvaluations",
	CYDRAN_EQUALS_MAX_EVALUATIONS: "cydran.equals.maxEvaluations",
	CYDRAN_PRODUCTION_ENABLED: "cydran.production.enabled"
};

interface IdsFields {
	STAGE: string;
}

const Ids: IdsFields = {
	STAGE: "$stage"
};

interface EventsFields {
	AFTER_CHILD_ADDED: string;
	AFTER_CHILD_CHANGED: string;
	AFTER_CHILD_REMOVED: string;
	AFTER_PARENT_ADDED: string;
	AFTER_PARENT_CHANGED: string;
	AFTER_PARENT_REMOVED: string;
	BEFORE_CHILD_ADDED: string;
	BEFORE_CHILD_CHANGED: string;
	BEFORE_CHILD_REMOVED: string;
	BEFORE_DISPOSE: string;
	BEFORE_PARENT_ADDED: string;
	BEFORE_PARENT_CHANGED: string;
	BEFORE_PARENT_REMOVED: string;
	COMPONENT_NESTING_CHANGED: string;
	CYDRAN_PREAPP_DISPOSAL: string;
}

const Events: EventsFields = {
	AFTER_CHILD_ADDED: "AFTER_CHILD_ADDED",
	AFTER_CHILD_CHANGED: "AFTER_CHILD_CHANGED",
	AFTER_CHILD_REMOVED: "AFTER_CHILD_REMOVED",
	AFTER_PARENT_ADDED: "AFTER_PARENT_ADDED",
	AFTER_PARENT_CHANGED: "AFTER_PARENT_CHANGED",
	AFTER_PARENT_REMOVED: "AFTER_PARENT_REMOVED",
	BEFORE_CHILD_ADDED: "BEFORE_CHILD_ADDED",
	BEFORE_CHILD_CHANGED: "BEFORE_CHILD_CHANGED",
	BEFORE_CHILD_REMOVED: "BEFORE_CHILD_REMOVED",
	BEFORE_DISPOSE: "BEFORE_DISPOSE",
	BEFORE_PARENT_ADDED: "BEFORE_PARENT_ADDED",
	BEFORE_PARENT_CHANGED: "BEFORE_PARENT_CHANGED",
	BEFORE_PARENT_REMOVED: "BEFORE_PARENT_REMOVED",
	COMPONENT_NESTING_CHANGED: "COMPONENT_NESTING_CHANGED",
	CYDRAN_PREAPP_DISPOSAL: "CYDRAN_PREAPP_DISPOSAL"
};

export {
	DEFAULT_MODULE_KEY,
	INTERNAL_DIRECT_CHANNEL_NAME,
	INTERNAL_CHANNEL_NAME,
	CYDRAN_PUBLIC_CHANNEL,
	MODULE_FIELD_NAME,
	NodeTypes,
	NO_OP_FN,
	EMPTY_OBJECT_FN,
	ANONYMOUS_REGION_PREFIX,
	DEFAULT_CLONE_DEPTH,
	DEFAULT_EQUALS_DEPTH,
	CYDRAN_SCRIPT_PREFIX,
	CYDRAN_KEY,
	STRING_TYPE,
	VALID_ID,
	VALID_KEY,
	DOM_KEY,
	INPUT_KEY,
	NESTING_CHANGED,
	Attrs,
	PropertyKeys,
	Events,
	Ids
};
