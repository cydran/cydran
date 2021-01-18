import ElementMediator from "mediator/ElementMediator";
import stateMachineBuilder from "machine/StateMachineBuilder";
import Machine from "machine/Machine";
import AbstractElementMediator from "mediator/AbstractElementMediator";

const LEAF_ELEMENT_MEDIATOR_MACHINE: Machine<
	ElementMediator<any, HTMLElement, any>
> = stateMachineBuilder<ElementMediator<any, HTMLElement, any>>("UNINITIALIZED")
	.withState("UNINITIALIZED", [])
	.withState("VALIDATED", [])
	.withState("READY", [])
	.withState("POPULATED", [])
	.withState("MOUNTED", [])
	.withState("UNMOUNTED", [])
	.withState("DISPOSED", [])
	.withTransition("UNINITIALIZED", "init", "READY", [
		AbstractElementMediator.prototype._initialize,
	])
	.withTransition("UNINITIALIZED", "validate", "VALIDATED", [
		AbstractElementMediator.prototype._validate,
	])
	.withTransition("VALIDATED", "init", "READY", [
		AbstractElementMediator.prototype._initialize,
	])
	.withTransition("READY", "dispose", "DISPOSED", [
		AbstractElementMediator.prototype._$dispose,
	])
	.withTransition("READY", "populate", "POPULATED", [
		AbstractElementMediator.prototype._populate,
	])
	.withTransition("POPULATED", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._mount,
	])
	.withTransition("MOUNTED", "unmount", "UNMOUNTED", [
		AbstractElementMediator.prototype._unmount,
	])
	.withTransition("MOUNTED", "digest", "MOUNTED", [
		AbstractElementMediator.prototype._digest,
	])
	.withTransition("UNMOUNTED", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._remount,
	])
	.withTransition("UNMOUNTED", "dispose", "DISPOSED", [
		AbstractElementMediator.prototype._$dispose,
	])
	.build();

	export default LEAF_ELEMENT_MEDIATOR_MACHINE;
	