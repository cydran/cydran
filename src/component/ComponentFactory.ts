import { Nestable } from "interface/ComponentInterfaces";

interface ComponentFactory {

	create(item?: any): Nestable;

}

export default ComponentFactory;
