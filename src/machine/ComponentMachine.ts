import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";
import ComponentInternalsImpl from "component/ComponentInternalsImpl";

const COMPONENT_MACHINE: Machine<ComponentInternalsImpl> = stateMachineBuilder<ComponentInternalsImpl>(
	"UNINITIALIZED"
)
	.withState("UNINITIALIZED", [])
	.withState("VALIDATED", [])
	.withState("READY", [])
	.withState("IDENTIFIED_CHILD", [])
	.withState("POPULATED", [])
	.withState("POPULATED_CHILD", [])
	.withState("PARSED", [])
	.withState("PARSED_CHILD", [])
	.withState("MOUNTED", [])
	.withState("UNMOUNTED", [])
	.withState("DISPOSED", [])
	.withTransition("UNINITIALIZED", "init", "READY", [
		ComponentInternalsImpl.prototype.initialize,
	])
	.withTransition("UNINITIALIZED", "validate", "VALIDATED", [
		ComponentInternalsImpl.prototype.validate,
	])
	.withTransition("VALIDATED", "init", "READY", [
		ComponentInternalsImpl.prototype.initialize,
	])
	.withTransition("READY", "markChild", "IDENTIFIED_CHILD", [])
	.withTransition("READY", "dispose", "DISPOSED", [
		ComponentInternalsImpl.prototype.$dispose,
	])
	.withTransition("READY", "populate", "POPULATED", [
		ComponentInternalsImpl.prototype.populate,
	])
	.withTransition("IDENTIFIED_CHILD", "populate", "POPULATED_CHILD", [
		ComponentInternalsImpl.prototype.populateChild,
	])
	.withTransition("POPULATED", "parse", "PARSED", [
		ComponentInternalsImpl.prototype.parse,
	])
	.withTransition("POPULATED_CHILD", "parse", "PARSED_CHILD", [
		ComponentInternalsImpl.prototype.parseChild,
	])
	.withTransition("PARSED", "mount", "MOUNTED", [ComponentInternalsImpl.prototype.mount])
	.withTransition("PARSED_CHILD", "mount", "MOUNTED", [
		ComponentInternalsImpl.prototype.mountChild,
	])
	.withTransition("MOUNTED", "unmount", "UNMOUNTED", [
		ComponentInternalsImpl.prototype.unmount,
	])
	.withTransition("MOUNTED", "digest", "MOUNTED", [
		ComponentInternalsImpl.prototype.digest,
	])
	.withTransition("UNMOUNTED", "mount", "MOUNTED", [
		ComponentInternalsImpl.prototype.remount,
	])
	.withTransition("UNMOUNTED", "dispose", "DISPOSED", [
		ComponentInternalsImpl.prototype.$dispose,
	])
	.build();

	export default COMPONENT_MACHINE;