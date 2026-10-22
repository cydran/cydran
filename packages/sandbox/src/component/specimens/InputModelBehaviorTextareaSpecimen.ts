import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorTextareaSpecimen.html";

/**
 * Specimen: demonstrates two-way `c-model` binding on a `<textarea>`.
 *
 * `text` is the only model field. The template binds it with `c-model` (DOM <-> model)
 * and mirrors it via `{{m().text}}` / `{{m().text.length}}` interpolation so a test can
 * observe the model from the rendered DOM. `stamp()`/`clear()` mutate the model to prove
 * the model -> DOM path. Multi-line input exercises textarea newline preservation.
 */
class InputModelBehaviorTextareaSpecimen extends Component {

	private text: string;

	constructor() {
		super(TEMPLATE);
		this.text = "initial";
	}

	public stamp(): void {
		this.text = "Cydran";
	}

	public clear(): void {
		this.text = "";
	}

}

export default InputModelBehaviorTextareaSpecimen;
