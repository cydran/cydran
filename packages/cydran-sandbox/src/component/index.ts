import ModalContainer from './ModalContainer';
import { Context } from "cydran";

function modalCapability(context: Context): void {
	context.getStage().addComponentAfter(new ModalContainer());
}

export { modalCapability };
