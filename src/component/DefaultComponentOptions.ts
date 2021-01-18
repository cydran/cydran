import { EMPTY_OBJECT_FN } from "const/Functions";
import InternalComponentOptions from "component/InternalComponentOptions";

const DEFAULT_COMPONENT_OPTIONS: InternalComponentOptions = {
	prefix: "c",
	itemFn: EMPTY_OBJECT_FN,
	parentModelFn: null,
	metadata: {},
	repeatable: false,
	alwaysConnected: false,
};

export default DEFAULT_COMPONENT_OPTIONS;