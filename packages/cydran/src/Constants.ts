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
const RESET_KEY: string = "reset" as const;
const STAGE_BODY_REGION_NAME: string = "body";

/**
 * Basic alphanumeric pattern.
 */
const ALPHA_NUMERIC_PARTIAL: RegExp = /[a-zA-Z][a-zA-Z0-9]*/;
const ALPHA_NUMERIC_FULL: RegExp = new RegExp(`^${ALPHA_NUMERIC_PARTIAL.source}$`);

// Partials
const OBJECT_ID_PARTIAL: RegExp = /[a-zA-Z0-9\*\:\_\-\.]+/;
const CONTEXT_NAME_PARTIAL: RegExp = ALPHA_NUMERIC_PARTIAL;
const PERIOD: RegExp = /\./;
const CURRENT_PATH: RegExp = PERIOD;
const PARENT_PATH: RegExp = /\.\./;
const SLASH: RegExp = /\//;
const PATH_SEGMENT: RegExp = new RegExp(`(${CURRENT_PATH.source}|${PARENT_PATH.source}|${CONTEXT_NAME_PARTIAL.source})`);
const RELATIVE_CONTEXT_PATH_PARTIAL: RegExp = new RegExp(`${PATH_SEGMENT.source}(${SLASH.source}${PATH_SEGMENT.source})+`);

// Full patterns
const CONTEXT_NAME: RegExp = new RegExp(`^${CONTEXT_NAME_PARTIAL.source}$`);
const OBJECT_ID: RegExp = new RegExp(`^${OBJECT_ID_PARTIAL.source}$`);
const SCOPE_KEY: RegExp = ALPHA_NUMERIC_FULL;
const REGION_NAME: RegExp = ALPHA_NUMERIC_FULL;
const PROPERTY_KEY: RegExp = new RegExp(`^${ALPHA_NUMERIC_PARTIAL.source}(${PERIOD.source}${ALPHA_NUMERIC_PARTIAL.source})*$`);
const RELATIVE_CONTEXT_PATH: RegExp = new RegExp(`^${RELATIVE_CONTEXT_PATH_PARTIAL.source}$`);
const LITERAL_CONTEXT_PATH: RegExp = new RegExp(`^${SLASH.source}${RELATIVE_CONTEXT_PATH_PARTIAL.source}$`);

const LITERAL_OBJECT_PATH: RegExp = new RegExp(`^(${SLASH.source}${PATH_SEGMENT.source})*${SLASH.source}${OBJECT_ID_PARTIAL.source}$`);
const RELATIVE_OBJECT_PATH: RegExp = new RegExp(`^(${PATH_SEGMENT.source}${SLASH.source})+${OBJECT_ID_PARTIAL.source}$`);

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
	PropertyKeys,
	RESET_KEY,
	TagNames,
	STAGE_BODY_REGION_NAME,

	// Patterns
	CONTEXT_NAME,
	OBJECT_ID,
	SCOPE_KEY,
	REGION_NAME,
	PROPERTY_KEY,
	RELATIVE_CONTEXT_PATH,
	LITERAL_CONTEXT_PATH,
	LITERAL_OBJECT_PATH,
	RELATIVE_OBJECT_PATH,

};
