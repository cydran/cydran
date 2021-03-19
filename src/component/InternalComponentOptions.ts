import ComponentOptions from "@/component/ComponentOptions";
import Nestable from '@/interface/ables/Nestable';
import Module from "@/module/Module";

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