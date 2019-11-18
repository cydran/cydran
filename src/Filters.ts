import GuardGenerator from "./GuardGenerator";

interface FiltersMap {

	[name: string]: Function;

}

class Filters {

	private code: string;

	private localFilters: FiltersMap;

	private filters: FiltersMap;

	private parent: Filters;

	private parentVersion: string;

	private version: string;

	private computedVersion: string;

	private generator: GuardGenerator;

	constructor(parent?: Filters) {
		this.localFilters = {};
		this.filters = {};
		this.code = "";
		this.parent = parent || null;
		this.generator = new GuardGenerator();
		this.parentVersion = (this.parent) ? this.parent.getVersion() : null;
		this.computedVersion = null;
		this.advanceVersion();
		this.checkFilters();
	}

	public getLocalFilters(): FiltersMap {
		return this.localFilters;
	}

	public getFilters(): FiltersMap {
		this.checkFilters();

		return this.filters;
	}

	public getCode(): string {
		this.checkFilters();

		return this.code;
	}

	public registerFilter(name: string, fn: Function) {
		this.localFilters[name] = fn;
		this.advanceVersion();
		this.checkFilters();
	}

	public getVersion(): string {
		return this.version;
	}

	private advanceVersion(): void {
		this.computedVersion = this.generator.generate();
	}

	private checkFilters(): void {
		const currentParentVersion: string = (this.parent) ? this.parent.getVersion() : null;

		if (this.version === this.computedVersion && this.parentVersion === currentParentVersion) {
			return;
		}

		this.filters = {};
		this.code = "";

		if (this.parent) {
			const parentFilters: FiltersMap = this.parent.getFilters();

			for (const key in parentFilters) {
				if (parentFilters.hasOwnProperty(key)) {
					this.filters[key] = parentFilters[key];
				}
			}
		}

		for (const key in this.localFilters) {
			if (this.localFilters.hasOwnProperty(key)) {
				this.filters[key] = this.localFilters[key];
			}
		}

		for (const key in this.filters) {
			if (this.filters.hasOwnProperty(key)) {
				const statement: string = "var " + key + " = arguments[0]['" + key + "'];\n";
				this.code += statement;
			}
		}

		this.version = this.computedVersion;
		this.parentVersion = currentParentVersion;
	}

}

export default Filters;
