import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";
import AbstractElementMediator from "mediator/AbstractElementMediator";

const ELEMENT_MEDIATOR_MACHINE: Machine<
	AbstractElementMediator<any, HTMLElement, any>
> = stateMachineBuilder<AbstractElementMediator<any, HTMLElement, any>>("UNINITIALIZED")
	.withState("UNINITIALIZED", [])
	.withState("LEAF", [])
	.withState("VALIDATED", [])
	.withState("VALIDATED_LEAF", [])
	.withState("READY", [])
	.withState("READY_LEAF", [])
	.withState("IDENTIFIED_CHILD", [])
	.withState("POPULATED", [])
	.withState("POPULATED_CHILD", [])
	.withState("POPULATED_LEAF", [])
	.withState("PARSED", [])
	.withState("PARSED_CHILD", [])
	.withState("MOUNTED", [])
	.withState("UNMOUNTED", [])
	.withState("DISPOSED", [])
	.withTransition("UNINITIALIZED", "leaf", "LEAF", [])
	.withTransition("UNINITIALIZED", "init", "READY", [
		AbstractElementMediator.prototype._initialize,
	])
	.withTransition("UNINITIALIZED", "validate", "VALIDATED", [
		AbstractElementMediator.prototype._validate,
	])
	.withTransition("LEAF", "init", "READY_LEAF", [
		AbstractElementMediator.prototype._initialize,
	])
	.withTransition("LEAF", "validate", "VALIDATED_LEAF", [
		AbstractElementMediator.prototype._validate,
	])
	.withTransition("VALIDATED", "init", "READY", [
		AbstractElementMediator.prototype._initialize,
	])
	.withTransition("VALIDATED_LEAF", "init", "READY_LEAF", [
		AbstractElementMediator.prototype._initialize,
	])
	.withTransition("READY", "markChild", "IDENTIFIED_CHILD", [])
	.withTransition("READY", "dispose", "DISPOSED", [
		AbstractElementMediator.prototype._$dispose,
	])
	.withTransition("READY", "populate", "POPULATED", [
		AbstractElementMediator.prototype._populate,
	])
	.withTransition("READY_LEAF", "populate", "POPULATED_LEAF", [
		AbstractElementMediator.prototype._populate,
	])
	.withTransition("IDENTIFIED_CHILD", "populate", "POPULATED_CHILD", [
		AbstractElementMediator.prototype._populateChild,
	])
	.withTransition("POPULATED", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._mount,
	])
	.withTransition("POPULATED_CHILD", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._mountChild,
	])
	.withTransition("POPULATED_LEAF", "mount", "MOUNTED", [
		AbstractElementMediator.prototype._mountChild,
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

	export default ELEMENT_MEDIATOR_MACHINE;