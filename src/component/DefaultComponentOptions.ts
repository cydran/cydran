import { EMPTY_OBJECT_FN } from "const/Functions";
import InternalComponentOptions from "component/InternalComponentOptions";
import { DEFAULT_PREFIX } from "const/HardValues";

const DEFAULT_COMPONENT_OPTIONS: InternalComponentOptions = {
	prefix: DEFAULT_PREFIX,
	itemFn: EMPTY_OBJECT_FN,
	parentModelFn: null,
	metadata: {},
	alwaysConnected: false
};

export default DEFAULT_COMPONENT_OPTIONS;
