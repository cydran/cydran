import stateMachineBuilder from "machine/StateMachineBuilder";
import Machine from "machine/Machine";
import ElementMediatorInternalsImpl from "mediator/ElementMediatorInternalsImpl";

const BASE_ELEMENT_MEDIATOR_MACHINE: Machine<
	ElementMediatorInternalsImpl<any, HTMLElement | Text, any>
> = stateMachineBuilder<ElementMediatorInternalsImpl<any, HTMLElement | Text, any>>(
	"UNINITIALIZED"
)
	.withState("UNINITIALIZED", [])
	.withState("VALIDATED", [])
	.withState("READY", [])
	.withState("POPULATED", [])
	.withState("MOUNTED", [])
	.withState("UNMOUNTED", [])
	.withState("DISPOSED", [])
	.withTransition("UNINITIALIZED", "init", "READY", [
		ElementMediatorInternalsImpl.prototype.initialize,
	])
	.withTransition("UNINITIALIZED", "validate", "VALIDATED", [
		ElementMediatorInternalsImpl.prototype.validate,
	])
	.withTransition("VALIDATED", "init", "READY", [
		ElementMediatorInternalsImpl.prototype.initialize,
	])
	.withTransition("READY", "dispose", "DISPOSED", [
		ElementMediatorInternalsImpl.prototype.$dispose,
	])
	.withTransition("READY", "populate", "POPULATED", [
		ElementMediatorInternalsImpl.prototype.populate,
	])
	.withTransition("POPULATED", "mount", "MOUNTED", [
		ElementMediatorInternalsImpl.prototype.mount,
	])

	.withTransition("MOUNTED", "populate", "MOUNTED", [
		() => {
			// Intentionally do nothing
		},
	])

	.withTransition("MOUNTED", "unmount", "UNMOUNTED", [
		ElementMediatorInternalsImpl.prototype.unmount,
	])
	.withTransition("MOUNTED", "digest", "MOUNTED", [
		ElementMediatorInternalsImpl.prototype.digest,
	])
	.withTransition("UNMOUNTED", "dispose", "DISPOSED", [
		ElementMediatorInternalsImpl.prototype.$dispose,
	])
	.build();

	export default BASE_ELEMENT_MEDIATOR_MACHINE;
