import {AbstractEventDecorator} from "../AbstractEventDecorator";

class VolumeChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("volumechange");
		this.listenTo("dom", "volumechange", this.handleEvent);
	}

}

export default VolumeChangeEventDecorator;
