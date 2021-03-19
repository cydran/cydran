import Nestable from "@/interface/ables/Nestable";

interface ComponentFactory {

	create(item?: any): Nestable;

}

export default ComponentFactory;