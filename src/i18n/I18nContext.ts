interface I18nContext {
	getContext(): string;

	setCategory(category: string): void;
	getCategory(): string;

	setGroup(group: string): void;
	getGroup(): string;

	setItem(item: string): void;
	getItem(): string;
}

export default I18nContext;
