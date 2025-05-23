import ComponentOptions from "component/ComponentOptions";
import { Context, Nestable } from "context/Context";

interface InternalComponentOptions extends ComponentOptions {

	itemFn?: () => any;

	parentModelFn?: () => any;

	context?: Context;

	alwaysConnected?: boolean;

	parent?: Nestable;

	name?: string;

}

export default InternalComponentOptions;
