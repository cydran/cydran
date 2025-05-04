import { AbstractBehavior } from "@cydran/cydran";
import { markdown } from "markdown";

class MarkdownBehavior extends AbstractBehavior<string, HTMLElement, unknown> {

	public onMount(): void {
		if (this.isMutable()) {
			this.getMediator().watch(this, this.onChange);
		}

		this.onChange(null, this.getMediator().get());
	}

	protected onChange(previous: string, current: string): void {
		if (current) {
			this.getEl().innerHTML = markdown.toHTML(current);
		}
	}

}

export default MarkdownBehavior;
