import { Nestable } from "context/Context";

interface ComponentFactory {

	create(item?: unknown): Nestable;

}

export default ComponentFactory;
