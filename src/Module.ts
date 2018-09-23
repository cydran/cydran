import {Registry} from "./Registry";

interface Module {

	getName(): string;

	associate(...componentClasses: any[]): Module;

	disassociate(...componentClasses: any[]): Module;

	clear(): Module;

	getRegistry(): Registry;

}

export default Module;
