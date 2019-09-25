import {AbstractEventDecorator} from "../AbstractEventDecorator";

class HashChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("hashchange");
		this.listenTo("dom", "hashchange", this.handleEvent);
	}

}

export default HashChangeEventDecorator;
