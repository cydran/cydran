import Nestable from "@/component/Nestable";

interface ComponentFactory {

	create(item?: any): Nestable;

}

export default ComponentFactory;
