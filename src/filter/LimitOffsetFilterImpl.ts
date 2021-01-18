import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

import FilterImpl from "filter/FilterImpl";
import { Filter, FilterBuilder, LimitOffsetFilter } from "filter/Filter";
import { requireNotNull, isDefined, equals } from "util/Utils";
import { DEFAULT_EQUALS_DEPTH } from "Constants";

class LimitOffsetFilterImpl implements LimitOffsetFilter {
	private parent: FilterImpl;

	private limiting: FilterImpl;

	private limit: number;

	private offset: number;

	private logger: Logger;

	constructor(parent: Filter) {
		this.logger = LoggerFactory.getLogger("LimitOffsetFilterImpl");
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.limiting = this.parent
			.extend()
			.withPhase((input: any[]) => {
				let result: any[] = input.slice(this.offset);

				if (isDefined(this.limit)) {
					result = result.slice(0, this.limit);
				}

				return result;
			})
			.build() as FilterImpl;
		this.offset = 0;
		this.limit = null;
	}

	public getLimit(): number {
		return this.limit;
	}

	public setLimit(limit: number): void {
		this.logger.ifTrace(() => `Limit set to: ${limit}`);
		this.limit = isDefined(limit) ? Math.floor(limit) : null;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public getOffset(): number {
		return this.offset;
	}

	public setOffset(offset: number): void {
		this.logger.ifTrace(() => `Offset set to: ${offset}`);
		this.offset = isDefined(offset) ? Math.floor(offset) : 0;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public setLimitAndOffset(limit: number, offset: number): void {
		this.logger.ifTrace(() => `Limit set to: ${limit}`);
		this.logger.ifTrace(() => `Offset set to: ${offset}`);
		const oldLimit: number = this.limit;
		const oldOffset: number = this.offset;

		this.limit = limit;
		this.offset = isDefined(offset) ? offset : 0;

		if (
			!equals(DEFAULT_EQUALS_DEPTH, oldLimit, this.limit) ||
			!equals(DEFAULT_EQUALS_DEPTH, oldOffset, this.offset)
		) {
			this.limiting.invalidate();
			this.limiting.refresh();
		}
	}

	public items(): any[] {
		return this.limiting.items();
	}

	public extend(): FilterBuilder {
		return this.limiting.extend();
	}

	public addCallback(context: any, callback: () => void): void {
		this.limiting.addCallback(context, callback);
	}
}

export default LimitOffsetFilterImpl;
