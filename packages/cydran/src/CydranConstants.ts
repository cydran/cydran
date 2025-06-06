enum Ids {
	ROOT_SELECTOR = "cydranRootSelector",
	STAGE = "cydranStage",
	STAGE_COMPONENT = "cydranStageComponent",
	STAGE_INTERNALS = "cydranStageInternals"
}

enum To {

	/**
	 * Sends a message globally to all contexts.
	 */
	GLOBALLY = "GLOBALLY",

	/**
	 * Sends a message to the current context.
	 */
	CONTEXT = "CONTEXT",
	
	/**
	 * Sends a message to all descendants of the current context.
	 */
	DESCENDANTS = "DESCENDANTS",
	
	/**
	 * Sends a message to all immediate children of the current context.
	 */
	IMMEDIATE_CHILDREN = "IMMEDIATE_CHILDREN",

	/**
	 * Sends a message to the parent of the current context.
	 */
	PARENT = "PARENT",
	
	/**
	 * Sends a message to all parents of the current context.
	 */
	PARENTS = "PARENTS",
	
	/**
	 * Sends a message to the root object.
	 */
	ROOT = "ROOT"
		
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
	CYDRAN_COMPONENT_STYLES = "c-component-styles",
	CYDRAN_SERIES = "c-series"
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

const DEFAULT_ID_KEY: string = "id";
const ANONYMOUS_REGION_PREFIX: string = "CydranAnonymousRegion000000" as const;
const ATTRIBUTE_DELIMITER: string = "-" as const;
const BEHAVIOR_KEY: string = "behavior" as const;
const CYDRAN_KEY: string = "cydran" as const;
const BEHAVIOR_FORM_RESET: string = `${CYDRAN_KEY}:${BEHAVIOR_KEY}:form:reset` as const;
const CHANGE_KEY: string = "change" as const;
const CYDRAN_RELEASE_FN_NAME = "$release" as const;
const CYDRAN_PUBLIC_CHANNEL: string = "Cydran$$Public$$Channel" as const;
const CYDRAN_SCRIPT_PREFIX: string = `${ CYDRAN_KEY }/` as const;
const DEFAULT_CLONE_DEPTH: number = 50 as const;
const DEFAULT_CONTEXT_KEY: string = "DEFAULT" as const;
const DEFAULT_EQUALS_DEPTH: number = 50 as const;
const DEFAULT_LOG_STRATEGY: string = "default" as const;
const DEFAULT_PREFIX: string = "c" as const;
const DOM_KEY: string = "dom" as const;
const FORM_KEY: string = "form" as const;
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
const DASH: RegExp = /\-/;
const CURRENT_PATH: RegExp = PERIOD;
const PARENT_PATH: RegExp = /\.\./;
const SLASH: RegExp = /\//;
const PATH_SEGMENT: RegExp = new RegExp(`(${CURRENT_PATH.source}|${PARENT_PATH.source}|${CONTEXT_NAME_PARTIAL.source})`);
const RELATIVE_CONTEXT_PATH_PARTIAL: RegExp = new RegExp(`${PATH_SEGMENT.source}(${SLASH.source}${PATH_SEGMENT.source})+`);
const LITERAL_CONTEXT_PATH_PARTIAL: RegExp = new RegExp(`${SLASH.source}${RELATIVE_CONTEXT_PATH_PARTIAL.source}`);
const LITERAL_OBJECT_PATH_PARTIAL: RegExp = new RegExp(`(${SLASH.source}${PATH_SEGMENT.source})*${SLASH.source}${OBJECT_ID_PARTIAL.source}`);
const RELATIVE_OBJECT_PATH_PARTIAL: RegExp = new RegExp(`(${PATH_SEGMENT.source}${SLASH.source})+${OBJECT_ID_PARTIAL.source}`);

// Full patterns
const CONTEXT_NAME: RegExp = new RegExp(`^${CONTEXT_NAME_PARTIAL.source}$`);
const OBJECT_ID: RegExp = new RegExp(`^${OBJECT_ID_PARTIAL.source}$`);
const SCOPE_KEY: RegExp = ALPHA_NUMERIC_FULL;
const REGION_NAME: RegExp = ALPHA_NUMERIC_FULL;
const SERIES_NAME: RegExp = ALPHA_NUMERIC_FULL;
const PROPERTY_SEGMENT: RegExp = /[a-zA-Z0-9]*/;
const PROPERTY_DELIMITER: RegExp = new RegExp(`(${PERIOD.source}|${DASH.source})`);
const PROPERTY_KEY: RegExp = new RegExp(`^${PROPERTY_SEGMENT.source}(${PROPERTY_DELIMITER.source}${PROPERTY_SEGMENT.source})*$`);
const LOCAL_CONTEXT_PATH: RegExp = new RegExp(`^${PERIOD.source}$`);
const PARENT_CONTEXT_PATH: RegExp = new RegExp(`^${PARENT_PATH.source}$`);
const RELATIVE_CONTEXT_PATH: RegExp = new RegExp(`^${RELATIVE_CONTEXT_PATH_PARTIAL.source}$`);
const LITERAL_CONTEXT_PATH: RegExp = new RegExp(`^${LITERAL_CONTEXT_PATH_PARTIAL.source}$`);

const LITERAL_OBJECT_PATH: RegExp = new RegExp(`^${LITERAL_OBJECT_PATH_PARTIAL.source}$`);
const RELATIVE_OBJECT_PATH: RegExp = new RegExp(`^${RELATIVE_OBJECT_PATH_PARTIAL.source}$`);
const REQUESTABLE_OBJECT_PATH: RegExp = new RegExp(`^(${OBJECT_ID_PARTIAL.source}|${LITERAL_OBJECT_PATH_PARTIAL.source}|${RELATIVE_OBJECT_PATH_PARTIAL.source})$`);

enum PropertyKeys {
	CYDRAN_CLONE_MAX_EVALUATIONS = "cydran.clone.maxEvaluations",
	CYDRAN_DIGEST_MAX_EVALUATIONS = "cydran.digest.maxEvaluations",
	CYDRAN_EQUALS_MAX_EVALUATIONS = "cydran.equals.maxEvaluations",
	CYDRAN_LAZY_STARTPHRASE = "cydran.lazy.startphrase",
	CYDRAN_LOG_COLOR_PREFIX = "cydran.logging.color",
	CYDRAN_LOG_LABEL = "cydran.logging.label",
	CYDRAN_LOG_LABEL_VISIBLE = "cydran.logging.label.visible",
	CYDRAN_LOG_LEVEL = "cydran.logging.level",
	CYDRAN_LOG_APPENDERS = "cydran.logging.appenders",
	CYDRAN_LOG_ALLOW_SUPRESS_DEFAULT_APPENDER = "cydran.logging.allowSupressDefaultAppender",
	CYDRAN_LOG_PREAMBLE_ORDER = "cydran.logging.pramble.order",
	CYDRAN_LOG_STRATEGY = "cydran.logging.strategy",
	CYDRAN_OVERRIDE_WINDOW = "cydran.override.window",
	CYDRAN_STARTUP_SYNCHRONOUS = "cydran.startup.synchronous",
	CYDRAN_STRICT_ENABLED = "cydran.strict.enabled",
	CYDRAN_STRICT_MESSAGE = "cydran.strict.message",
	CYDRAN_STRICT_STARTPHRASE = "cydran.strict.startphrase",
	CYDRAN_STYLES_ENABLED = "cydran.styles.enabled"
}

const DEFAULT_PROPERTIES_VALUES = {
	[`${ PropertyKeys.CYDRAN_DIGEST_MAX_EVALUATIONS }`]: 10000,
	[`${ PropertyKeys.CYDRAN_CLONE_MAX_EVALUATIONS }`]: 50,
	[`${ PropertyKeys.CYDRAN_EQUALS_MAX_EVALUATIONS }`]: 50,
	[`${ PropertyKeys.CYDRAN_STRICT_ENABLED }`]: true,
	[`${ PropertyKeys.CYDRAN_LOG_STRATEGY }`]: "default",
	[`${ PropertyKeys.CYDRAN_LOG_LEVEL }`]: "debug",
	[`${ PropertyKeys.CYDRAN_LOG_APPENDERS }`]: "consoleAppender",
	[`${ PropertyKeys.CYDRAN_LOG_ALLOW_SUPRESS_DEFAULT_APPENDER }`]: false,
	[`${ PropertyKeys.CYDRAN_LOG_LABEL }`]: "",
	[`${ PropertyKeys.CYDRAN_LOG_LABEL_VISIBLE }`]: false,
	[`${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.trace`]: "#ffd478",
	[`${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.debug`]: "#008e00",
	[`${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.info`]: "#0096ff",
	[`${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.warn`]: "#ff9400",
	[`${ PropertyKeys.CYDRAN_LOG_PREAMBLE_ORDER }`]: "time:level:name",
	[`${ PropertyKeys.CYDRAN_STYLES_ENABLED }`]: true,
	[`${ PropertyKeys.CYDRAN_STRICT_STARTPHRASE }`]: "To infinity and beyond!",
	[`${ PropertyKeys.CYDRAN_LAZY_STARTPHRASE }`]: "Fire in the hole!",
	[`${ PropertyKeys.CYDRAN_STRICT_MESSAGE }`]: "Additional overhead due to enhanced validation, constraint checks, and dev tools WILL occur. Features are NOT restricted by mode or license."
} as const;

enum StageComponentSeries {
	TOP = "top",
	BOTTOM = "bottom"
}

export {
	ANONYMOUS_REGION_PREFIX,
	ATTRIBUTE_DELIMITER,
	Attrs,
	BEHAVIOR_KEY,
	BEHAVIOR_FORM_RESET,
	CHANGE_KEY,
	CYDRAN_RELEASE_FN_NAME,
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
	FORM_KEY,
	INPUT_KEY,
	INTERNAL_CHANNEL_NAME,
	Ids,
	StageComponentSeries,
	To,
	JSType,
	PropertyKeys,
	RESET_KEY,
	TagNames,
	STAGE_BODY_REGION_NAME,
	DEFAULT_PROPERTIES_VALUES,

	// Patterns
	CONTEXT_NAME,
	OBJECT_ID,
	SCOPE_KEY,
	REGION_NAME,
	SERIES_NAME,
	PROPERTY_KEY,
	RELATIVE_CONTEXT_PATH,
	LITERAL_CONTEXT_PATH,
	LITERAL_OBJECT_PATH,
	RELATIVE_OBJECT_PATH,
	REQUESTABLE_OBJECT_PATH,
	LOCAL_CONTEXT_PATH,
	PARENT_CONTEXT_PATH
};
