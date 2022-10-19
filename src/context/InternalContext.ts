import Behavior from "behavior/Behavior";
import Context from "context/Context";
import Type from "interface/Type";
import Registry from "registry/Registry";
import Services from "service/Services";

interface InternalContext extends Context {

	getServices(): Services;

	getRegistry(): Registry;

	registerConstantUnguarded(id: string, instance: any): void;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

}

export default InternalContext;