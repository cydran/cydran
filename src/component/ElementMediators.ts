import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import ElementMediator from "mediator/ElementMediator";

interface ElementMediators extends Tellable, Disposable {

	add(mediator: ElementMediator<any, HTMLElement | Text, any>);

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default ElementMediators;
