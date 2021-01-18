import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

import FilterImpl from "filter/FilterImpl";
import LimitOffsetFilterImpl from "filter/LimitOffsetFilterImpl";
import { Filter, FilterBuilder, PagedFilter } from "filter/Filter";
import { requireNotNull } from "util/Utils";

class PagedFilterImpl implements PagedFilter {
	private parent: FilterImpl;

	private limited: LimitOffsetFilterImpl;

	private page: number;

	private pageSize: number;

	private atBeginning: boolean;

	private atEnd: boolean;

	private moreBefore: boolean;

	private moreAfter: boolean;

	private logger: Logger;

	constructor(parent: Filter) {
		this.logger = LoggerFactory.getLogger("PagedFilterImpl");
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.limited = this.parent.extend().limited() as LimitOffsetFilterImpl;
		this.page = 0;
		this.pageSize = 10;
		this.parent.addCallback(this, () => {
			this.enforcePageBounds();
			this.sync();
		});
		this.sync();
	}

	public getPageSize(): number {
		return this.pageSize;
	}

	public setPageSize(size: number): void {
		this.logger.ifTrace(() => `Page size set to: ${size}`);
		this.pageSize = size < 1 ? 1 : Math.floor(size);
		this.sync();
	}

	public getTotalPages(): number {
		return Math.ceil(this.parent.items().length / this.pageSize);
	}

	public getPage(): number {
		return this.page;
	}

	public setPage(page: number): void {
		this.logger.ifTrace(() => `Page set to: ${page}`);
		this.page = Math.floor(page);
		this.enforcePageBounds();

		this.sync();
	}

	public toPrevious(): void {
		this.setPage(this.page - 1);
	}

	public toNext(): void {
		this.setPage(this.page + 1);
	}

	public toStart(): void {
		this.setPage(0);
	}

	public toEnd(): void {
		this.setPage(this.getTotalPages());
	}

	public items(): any[] {
		return this.limited.items();
	}

	public extend(): FilterBuilder {
		return this.limited.extend();
	}

	public addCallback(context: any, callback: () => void): void {
		this.limited.addCallback(context, callback);
	}

	public enforcePageBounds(): void {
		if (this.page < 0) {
			this.page = 0;
		}

		if (this.page >= this.getTotalPages()) {
			this.page = this.getTotalPages() - 1;
		}

		if (this.page < 0) {
			this.page = 0;
		}

		this.logger.ifTrace(() => `Page normalized to: ${this.page}`);
	}

	public isAtBeginning(): boolean {
		return this.atBeginning;
	}

	public isAtEnd(): boolean {
		return this.atEnd;
	}

	public isMoreBefore(): boolean {
		return this.moreBefore;
	}

	public isMoreAfter(): boolean {
		return this.moreAfter;
	}

	private sync(): void {
		this.atBeginning = this.page === 0;
		this.atEnd = this.page >= this.getTotalPages() - 1;
		this.moreBefore = !this.atBeginning;
		this.moreAfter = !this.atEnd;
		this.limited.setLimitAndOffset(this.pageSize, this.page * this.pageSize);
	}
}

export default PagedFilterImpl;
