import { Component } from "cydran";
import TEMPLATE from "./AbstractMarkdownComponent.html";

abstract class AbstractMarkdownComponent extends Component {

	private documentTitle: string;

	private markdown: string;

	private focusForced: boolean;

	constructor(title: string, markdown: string) {
		super(TEMPLATE, {
			metadata: {
				title: title,
				markdown: markdown
			}
		});
		this.documentTitle = this.$c().metadata().get("title");
		this.markdown = this.$c().metadata().get("markdown");
		this.focusForced = true;
	}

	public toggleForcedFocus(): void {
		this.focusForced = !this.focusForced;
	}

	public imposeFocus(): void {
		this.$c().forElement("focused-input").focus();
	}

}

export default AbstractMarkdownComponent;
