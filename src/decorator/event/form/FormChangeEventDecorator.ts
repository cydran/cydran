import {AbstractEventDecorator} from "../AbstractEventDecorator";

class FormChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("formchange");
		this.listenTo("dom", "formchange", this.handleEvent);
	}

}

export default FormChangeEventDecorator;
