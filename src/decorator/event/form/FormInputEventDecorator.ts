import {AbstractEventDecorator} from "../AbstractEventDecorator";

class FormInputEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("forminput");
		this.listenTo("dom", "forminput", this.handleEvent);
	}

}

export default FormInputEventDecorator;
