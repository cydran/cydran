import ComponentOptions from "component/ComponentOptions";
import { Context } from "context/Context";
import { Nestable } from "interface/ComponentInterfaces";

interface InternalComponentOptions extends ComponentOptions {

	itemFn?: () => any;

	parentModelFn?: () => any;

	context?: Context;

	alwaysConnected?: boolean;

	parent?: Nestable;

	name?: string;

}

export default InternalComponentOptions;
