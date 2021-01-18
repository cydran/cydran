import ElementMediator from "mediator/ElementMediator";
import stateMachineBuilder from "machine/StateMachineBuilder";
import Machine from "machine/Machine";

const BRANCH_ELEMENT_MEDIATOR_MACHINE: Machine<
	ElementMediator<any, HTMLElement, any>
> = stateMachineBuilder<ElementMediator<any, HTMLElement, any>>("UNINITIALIZED")
	.withState("UNINITIALIZED", [])
	.build();

export default BRANCH_ELEMENT_MEDIATOR_MACHINE;