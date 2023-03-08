import { Context } from "context/Context";
import Registry from "registry/Registry";

interface InternalContext extends Context {

	getRegistry(): Registry;

	registerConstantUnguarded(id: string, instance: any): void;

}

export default InternalContext;