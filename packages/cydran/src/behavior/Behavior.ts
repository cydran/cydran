import Tellable from "interface/ables/Tellable";
import DigestableSource from "behavior/DigestableSource";
import Messagable from "interface/ables/Messagable";

interface Behavior<M, E extends HTMLElement | Text, P> extends DigestableSource, Tellable, Messagable {

	requestDigestionSources(sources: DigestableSource[]): void;

	onInit(dependencies?: unknown): void;

	onMount(): void;

	onUnmount(): void;

	onRemount(): void;

	isFlagged(name: string): boolean;

}

export default Behavior;
