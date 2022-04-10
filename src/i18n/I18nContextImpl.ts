import I18nContext from "i18n/I18nContext";
import { CYDRAN_KEY, DEFAULT_MODULE_KEY } from "const/HardValues";
import { requireNotNull } from "util/Utils";

class I18nContextImpl implements I18nContext {

	private context: string;
	private category: string;
	private group: string;
	private item: string;

	constructor(context: string = CYDRAN_KEY, category: string = DEFAULT_MODULE_KEY) {
		this.context = context;
		this.category = category;
	}

	public getContext(): string {
		return this.context;
	}

	public setCategory(category: string): void {
		this.category = requireNotNull(category, "category");
	}

	public getCategory(): string {
		return this.category;
	}

	public setGroup(group: string): void {
		this.group = requireNotNull(group, "group");
	}

	public getGroup(): string {
		return this.group;
	}

	public setItem(item: string): void {
		this.item = requireNotNull(item, "item");
	}

	public getItem(): string {
		return this.item;
	}
}

export default I18nContextImpl;
