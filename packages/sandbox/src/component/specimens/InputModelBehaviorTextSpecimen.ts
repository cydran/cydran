import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorTextSpecimen.html";

/**
 * Specimen: demonstrates two-way `c-model` binding on an `<input type="text">`.
 *
 * `text` is the only model field. The template binds it with `c-model` (DOM <-> model)
 * and mirrors it via `{{m().text}}` interpolation so a test can observe the model from
 * the rendered DOM. `stamp()`/`clear()` mutate the model to prove the model -> DOM path.
 */
class InputModelBehaviorTextSpecimen extends Component {

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

export default InputModelBehaviorTextSpecimen;
