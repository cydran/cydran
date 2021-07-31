import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import MediatorSource from "mediator/MediatorSource";
import Validators from "validator/Validators";

interface ElementMediator<M, E extends HTMLElement | Text, P> extends Disposable, MediatorSource, Tellable {

	/**
	 * Send a message directly to named channel
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	message(channelName: string, messageName: string, payload?: any): void;

	is(name: string): boolean;

	onInit(): void;

	onPopulate(): void;

	onMount(): void;

	onRemount(): void;

	onUnmount(): void;

	onDispose(): void;

	onValidate(el: E, fn: (name: string, value?: any) => Validators): void;

	onNestingChanged(): void;

	isFlagged(name: string): boolean;

}

export default ElementMediator;
