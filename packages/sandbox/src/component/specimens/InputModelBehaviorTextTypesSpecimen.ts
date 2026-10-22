import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorTextTypesSpecimen.html";

/**
 * Specimen: two-way `c-model` across text-like input types (email, password, search,
 * tel, url). All resolve to the STRING accessor strategy of `ValuedModelBehavior`
 * (`el.value`), so every field is a plain string. One specimen covers the breadth
 * because the binding path is identical for each type.
 */
class InputModelBehaviorTextTypesSpecimen extends Component {

	private email: string;

	private password: string;

	private search: string;

	private tel: string;

	private url: string;

	constructor() {
		super(TEMPLATE);
		this.email = "user@example.com";
		this.password = "s3cret";
		this.search = "cydran";
		this.tel = "555-0100";
		this.url = "https://cydran.org";
	}

}

export default InputModelBehaviorTextTypesSpecimen;
