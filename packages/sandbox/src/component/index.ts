import { Stage } from "@cydran/cydran";
import ModalContainer from "./ModalContainer";

function modalInitializer(stage: Stage): void {
	const container: ModalContainer = new ModalContainer();
	stage.after().insertLast(container);
}

export { modalInitializer };
