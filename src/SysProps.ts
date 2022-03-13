import {  PropertyKeys  } from "Constants";

const SYSPROPS = {
	[`-|${ PropertyKeys.CYDRAN_DIGEST_MAX_EVALUATIONS }`]: 10000,
	[`-|${ PropertyKeys.CYDRAN_CLONE_MAX_EVALUATIONS }`]: 50,
	[`-|${ PropertyKeys.CYDRAN_EQUALS_MAX_EVALUATIONS }`]: 50,
	[`+-|${ PropertyKeys.CYDRAN_STRICT_ENABLED }`]: false,
	[`+-|${ PropertyKeys.CYDRAN_LOG_STRATEGY }`]: "default",
	[`+-|${ PropertyKeys.CYDRAN_LOG_LEVEL }`]: "debug",
	[`+-|${ PropertyKeys.CYDRAN_LOG_LABEL }`]: "",
	[`+-|${ PropertyKeys.CYDRAN_LOG_LABEL_VISIBLE }`]: false,
	[`+-|${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.fullstack`]: "#ff2f92",
	[`+-|${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.trace`]: "#ffd478",
	[`+-|${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.debug`]: "#008e00",
	[`+-|${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.info`]: "#0096ff",
	[`+-|${ PropertyKeys.CYDRAN_LOG_COLOR_PREFIX }.warn`]: "#ff9400",
	[`+-|${ PropertyKeys.CYDRAN_LOG_PREAMBLE_ORDER }`]: "time:level:name",
	[`+-|${ PropertyKeys.CYDRAN_STYLES_ENABLED }`]: true,
	[`+-|${ PropertyKeys.CYDRAN_STRICT_STARTPHRASE }`]: "Fire in the hole!",
	[`+-|${ PropertyKeys.CYDRAN_LAZY_STARTPHRASE }`]: "To infinity and beyond!",
	[`-|${ PropertyKeys.CYDRAN_LAZY_MESSAGE }`]: "Additional overhead due to enhanced validation, constraint checks, and dev tools WILL occur. Features are NOT restricted by mode or license."
 } as const;

export default SYSPROPS;
