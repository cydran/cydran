import Module from "module/Module";
import ComponentOptions from "component/ComponentOptions";
import Nestable from "interface/ables/Nestable";

interface InternalComponentOptions extends ComponentOptions {

	itemFn?: () => any;

	parentModelFn?: () => any;

	module?: Module;

	alwaysConnected?: boolean;

	parent?: Nestable;

	name?: string;

}

export default InternalComponentOptions;
