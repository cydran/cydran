import Module from "module/Module";
import ComponentOptions from "component/ComponentOptions";
import Nestable from "interface/ables/Nestable";

interface InternalComponentOptions extends ComponentOptions {

	repeatable?: boolean;

	itemFn?: () => any;

	parentModelFn?: () => any;

	module?: Module;

	alwaysConnected?: boolean;

	parent?: Nestable;

	skipId?: string;

}

export default InternalComponentOptions;
