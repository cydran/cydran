interface Module {

	getName(): string;

	associate(...componentClasses: any[]): Module;

	disassociate(...componentClasses: any[]): Module;

	clear(): Module;

}

export default Module;
