import { Nestable } from "context/Context";

interface ComponentFactory {

	create(item?: any): Nestable;

}

export default ComponentFactory;
