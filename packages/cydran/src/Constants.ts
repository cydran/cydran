enum Ids {
	ROOT_SELECTOR = "cydranRootSelector",
	STAGE = "cydranStage",
	STAGE_COMPONENT = "cydranStageComponent",
	STAGE_INTERNALS = "cydranStageInternals"
}

enum Attrs {
	ID = "id",
	NAME = "name",
	COMPONENT = "component",
	CONTEXT = "context",
	VALUE = "value",
	LOCK = "lock",
	TYPE = "type",
	TEST = "test"
}

enum CydranMode {
	STRICT = "strict",
	LAZY = "lazy"
}

enum DigestionActions {
	REQUEST_DIGESTION_SOURCES = "REQUEST_DIGESTION_SOURCES",
	REQUEST_DIGESTION_CANDIDATES = "REQUEST_DIGESTION_CANDIDATES"
}

enum TagNames {
	SCRIPT = "script",
	TEMPLATE = "template",
	CYDRAN_REGION = "c-region",
	CYDRAN_COMPONENT_STYLES = "c-component-styles"
}

const JSType = {
	STR: "string",
	BOOL: "boolean",
	BIGINT: "bigint",
	NUM: "number",
	SYM: "symbol",
	FN: "function",
	OBJ: "object",
	UND: "undefined"
} as const;

enum Events {
	AFTER_CHILD_ADDED = "AFTER_CHILD_ADDED",
	AFTER_CHILD_CHANGED = "AFTER_CHILD_CHANGED",
	AFTER_CHILD_REMOVED = "AFTER_CHILD_REMOVED",
	AFTER_PARENT_ADDED = "AFTER_PARENT_ADDED",
	AFTER_PARENT_CHANGED = "AFTER_PARENT_CHANGED",
	AFTER_PARENT_REMOVED = "AFTER_PARENT_REMOVED",
	BEFORE_CHILD_ADDED = "BEFORE_CHILD_ADDED",
	BEFORE_CHILD_CHANGED = "BEFORE_CHILD_CHANGED",
	BEFORE_CHILD_REMOVED = "BEFORE_CHILD_REMOVED",
	BEFORE_PARENT_ADDED = "BEFORE_PARENT_ADDED",
	BEFORE_PARENT_CHANGED = "BEFORE_PARENT_CHANGED",
	BEFORE_PARENT_REMOVED = "BEFORE_PARENT_REMOVED",
	COMPONENT_NESTING_CHANGED = "COMPONENT_NESTING_CHANGED",
	CYDRAN_PREAPP_DISPOSAL = "CYDRAN_PREAPP_DISPOSAL"
}

enum PropertyKeys {
	CYDRAN_CLONE_MAX_EVALUATIONS = "cydran.clone.maxEvaluations",
	CYDRAN_DIGEST_MAX_EVALUATIONS = "cydran.digest.maxEvaluations",
	CYDRAN_EQUALS_MAX_EVALUATIONS = "cydran.equals.maxEvaluations",
	CYDRAN_LAZY_STARTPHRASE = "cydran.lazy.startphrase",
	CYDRAN_LOG_COLOR_PREFIX = "cydran.logging.color",
	CYDRAN_LOG_LABEL = "cydran.logging.label",
	CYDRAN_LOG_LABEL_VISIBLE = "cydran.logging.label.visible",
	CYDRAN_LOG_LEVEL = "cydran.logging.level",
	CYDRAN_LOG_PREAMBLE_ORDER = "cydran.logging.pramble.order",
	CYDRAN_LOG_STRATEGY = "cydran.logging.strategy",
	CYDRAN_OVERRIDE_WINDOW = "cydran.override.window",
	CYDRAN_STARTUP_SYNCHRONOUS = "cydran.startup.synchronous",
	CYDRAN_STRICT_ENABLED = "cydran.strict.enabled",
	CYDRAN_STRICT_MESSAGE = "cydran.strict.message",
	CYDRAN_STRICT_STARTPHRASE = "cydran.strict.startphrase",
	CYDRAN_STYLES_ENABLED = "cydran.styles.enabled"
}

const DEFAULT_ID_KEY: string = "id";
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
const LITERAL_PATH_REGEX: RegExp = /^(\/([a-zA-Z0-9]+|\.\.|\.))*\/[^\/]+$/;
const LOCAL_ID_REGEX: RegExp = /^[^\/]+$/;
const RELATIVE_PATH_REGEX: RegExp = /^([a-zA-Z0-9]+|\.\.|\.)(\/([a-zA-Z0-9]+|\.\.|\.))*\/[^\/]+$/;
const RESET_KEY: string = "reset" as const;
const VALID_ID: RegExp = /^[^\/\.]+$/m;
const VALID_KEY: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z\d\$\_\*]*$/);
const STAGE_BODY_REGION_NAME: string = "body";

export {
	ANONYMOUS_REGION_PREFIX,
	ATTRIBUTE_DELIMITER,
	Attrs,
	BEHAVIOR_FORM_RESET,
	CHANGE_KEY,
	CYDRAN_DISPOSE_FN_NAME,
	CYDRAN_KEY,
	CYDRAN_PUBLIC_CHANNEL,
	CYDRAN_SCRIPT_PREFIX,
	CydranMode,
	DEFAULT_CLONE_DEPTH,
	DEFAULT_CONTEXT_KEY,
	DEFAULT_EQUALS_DEPTH,
	DEFAULT_ID_KEY,
	DEFAULT_LOG_STRATEGY,
	DEFAULT_PREFIX,
	DOM_KEY,
	DigestionActions,
	Events,
	INPUT_KEY,
	INTERNAL_CHANNEL_NAME,
	Ids,
	JSType,
	LITERAL_PATH_REGEX,
	LOCAL_ID_REGEX,
	PropertyKeys,
	RELATIVE_PATH_REGEX,
	RESET_KEY,
	TagNames,
	VALID_ID,
	VALID_KEY,
	STAGE_BODY_REGION_NAME
};
