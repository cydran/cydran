import { Component } from "@cydran/cydran";
import TEMPLATE from "./SpecimensHome.html";

interface Group {

	id: string;

	title: string;

	items: Item[];

}

interface Item {

	id: string;

	title: string;

}

class SpecimensHome extends Component {

	private activeItem: string;

	private groups: Group[];

	constructor() {
		super(TEMPLATE);
		this.groups = [
			{
				id: "intro",
				title: "",
				items: [
					{
						id: "intro",
						title: "Introduction"
					}
				]
			},
			{
				id: "behaviors",
				title: "Behaviors",
				items: [
					{
						id: "notyetimplemented",
						title: "Input Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Each Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Hidden Behavior"
					},
					{
						id: "notyetimplemented",
						title: "MultiSelect Value Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Required Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Validated Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Attribute Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Enabled Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Id Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Radio Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Series Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Valued Model Behavior"
					},
					{
						id: "notyetimplemented",
						title: "CSS Class Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Focus Behavior"
					},
					{
						id: "notyetimplemented",
						title: "If Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Read Only Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Style Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Checked Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Form Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Inert Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Region Behavior"
					},
					{
						id: "notyetimplemented",
						title: "Text Behavior"
					}
				]
			},
			{
				id: "legacy",
				title: "Legacy",
				items: [
					{
						id: "logging",
						title: "Logging"
					},
					{
						id: "regions",
						title: "Regions"
					},
					{
						id: "validation",
						title: "Validation"
					},
					{
						id: "radioButtons",
						title: "Radio Buttons"
					},
					{
						id: "multiSelects",
						title: "Multi-Selects"
					},
					{
						id: "sharedModel",
						title: "Shared Model"
					},
					{
						id: "readOnly",
						title: "Read Only"
					},
					{
						id: "svg",
						title: "SVG"
					},
					{
						id: "checkboxState",
						title: "Checkbox State"
					},
					{
						id: "modals",
						title: "Modals"
					},
					{
						id: "watchedField",
						title: "Watched Field"
					},
					{
						id: "focusedEach",
						title: "Focused Each"
					},
					{
						id: "clock",
						title: "Clock"
					},
					{
						id: "webComponentExample",
						title: "Web Component"
					},
					{
						id: "formElements",
						title: "Form Elements"
					},
					{
						id: "typedInputs",
						title: "Typed Inputs"
					}
				]
			},
			{
				id: "pending",
				title: "Pending",
				items: [
					{
						id: "notyetimplemented",
						title: "Stage: create mounts to selector"
					},
					{
						id: "notyetimplemented",
						title: "Stage: properties map applied"
					},
					{
						id: "notyetimplemented",
						title: "Stage: root capability callback"
					},
					{
						id: "notyetimplemented",
						title: "Stage: setComponent (imperative root)"
					},
					{
						id: "notyetimplemented",
						title: "Stage: setComponentByObjectId (DI root)"
					},
					{
						id: "notyetimplemented",
						title: "Stage: start / isStarted"
					},
					{
						id: "notyetimplemented",
						title: "Stage: $release teardown"
					},
					{
						id: "notyetimplemented",
						title: "Stage: initializer ordering"
					},
					{
						id: "notyetimplemented",
						title: "Stage: before() series"
					},
					{
						id: "notyetimplemented",
						title: "Stage: after() series"
					},
					{
						id: "notyetimplemented",
						title: "Stage: synchronous startup"
					},
					{
						id: "notyetimplemented",
						title: "Stage: asynchronous startup"
					},
					{
						id: "notyetimplemented",
						title: "Stage: noConflict"
					},
					{
						id: "notyetimplemented",
						title: "Component: template as string"
					},
					{
						id: "notyetimplemented",
						title: "Component: template as HTMLElement"
					},
					{
						id: "notyetimplemented",
						title: "Component: template as Renderer"
					},
					{
						id: "notyetimplemented",
						title: "Component: onMount"
					},
					{
						id: "notyetimplemented",
						title: "Component: onUnmount"
					},
					{
						id: "notyetimplemented",
						title: "Component: onRemount"
					},
					{
						id: "notyetimplemented",
						title: "Component: prefix override"
					},
					{
						id: "notyetimplemented",
						title: "Component: options.name"
					},
					{
						id: "notyetimplemented",
						title: "Component: options.styles"
					},
					{
						id: "notyetimplemented",
						title: "Component: options.metadata"
					},
					{
						id: "notyetimplemented",
						title: "Component: ElementComponent custom element"
					},
					{
						id: "notyetimplemented",
						title: "Region: basic placement"
					},
					{
						id: "notyetimplemented",
						title: "Region: named lookup"
					},
					{
						id: "notyetimplemented",
						title: "Region: auto-generated name"
					},
					{
						id: "notyetimplemented",
						title: "Region: value surfacing to v()"
					},
					{
						id: "notyetimplemented",
						title: "Region: lock prevents replace"
					},
					{
						id: "notyetimplemented",
						title: "Region: lock prevents remove"
					},
					{
						id: "notyetimplemented",
						title: "Region: path DI child"
					},
					{
						id: "notyetimplemented",
						title: "Region: regions().set"
					},
					{
						id: "notyetimplemented",
						title: "Region: regions().get"
					},
					{
						id: "notyetimplemented",
						title: "Region: regions().has"
					},
					{
						id: "notyetimplemented",
						title: "Region: regions().setByObjectId"
					},
					{
						id: "notyetimplemented",
						title: "Region: single-occupancy replace"
					},
					{
						id: "notyetimplemented",
						title: "Series: insertFirst"
					},
					{
						id: "notyetimplemented",
						title: "Series: insertLast"
					},
					{
						id: "notyetimplemented",
						title: "Series: insertBefore"
					},
					{
						id: "notyetimplemented",
						title: "Series: insertAfter"
					},
					{
						id: "notyetimplemented",
						title: "Series: remove"
					},
					{
						id: "notyetimplemented",
						title: "Series: removeAt"
					},
					{
						id: "notyetimplemented",
						title: "Series: replace"
					},
					{
						id: "notyetimplemented",
						title: "Series: replaceAt"
					},
					{
						id: "notyetimplemented",
						title: "Series: getAt"
					},
					{
						id: "notyetimplemented",
						title: "Series: clear"
					},
					{
						id: "notyetimplemented",
						title: "Series: contains / isEmpty / hasComponents"
					},
					{
						id: "notyetimplemented",
						title: "Expr: m() model"
					},
					{
						id: "notyetimplemented",
						title: "Expr: v() region value"
					},
					{
						id: "notyetimplemented",
						title: "Expr: s() scope item"
					},
					{
						id: "notyetimplemented",
						title: "Expr: s() chain override"
					},
					{
						id: "notyetimplemented",
						title: "Expr: p().$event"
					},
					{
						id: "notyetimplemented",
						title: "Expr: pure JS operators"
					},
					{
						id: "notyetimplemented",
						title: "Expr: value read (get)"
					},
					{
						id: "notyetimplemented",
						title: "Expr: value assign (set / two-way)"
					},
					{
						id: "notyetimplemented",
						title: "DI: registerConstant"
					},
					{
						id: "notyetimplemented",
						title: "DI: registerSingleton"
					},
					{
						id: "notyetimplemented",
						title: "DI: registerSingletonWithFactory"
					},
					{
						id: "notyetimplemented",
						title: "DI: registerPrototype"
					},
					{
						id: "notyetimplemented",
						title: "DI: registerPrototypeWithFactory"
					},
					{
						id: "notyetimplemented",
						title: "DI: resolution up-tree"
					},
					{
						id: "notyetimplemented",
						title: "DI: localResolution false (origin deps)"
					},
					{
						id: "notyetimplemented",
						title: "DI: localResolution true (local override)"
					},
					{
						id: "notyetimplemented",
						title: "DI: registerImplicit"
					},
					{
						id: "notyetimplemented",
						title: "DI: hasRegistration"
					},
					{
						id: "notyetimplemented",
						title: "DI: addChild / getChild"
					},
					{
						id: "notyetimplemented",
						title: "DI: removeChild"
					},
					{
						id: "notyetimplemented",
						title: "DI: getFullName / path"
					},
					{
						id: "notyetimplemented",
						title: "DI: initializer"
					},
					{
						id: "notyetimplemented",
						title: "DI: preInitializer"
					},
					{
						id: "notyetimplemented",
						title: "DI: disposer"
					},
					{
						id: "notyetimplemented",
						title: "DI: configure()"
					},
					{
						id: "notyetimplemented",
						title: "DI: ContextAware setContext"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: with(id)"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withProvider"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withContext"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withProperty"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withPropertyProvider"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withPropertySubscriber"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withPropertyFallbackSubscriber"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withScopeItem"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withLogger"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withTransmitter"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withReceiver"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withMessageSubscriber"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withInstanceId / Provider"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withArgument"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withConstant"
					},
					{
						id: "notyetimplemented",
						title: "Resolver: withFunction"
					},
					{
						id: "notyetimplemented",
						title: "Props: get / getAsString"
					},
					{
						id: "notyetimplemented",
						title: "Props: isDefined / includes"
					},
					{
						id: "notyetimplemented",
						title: "Props: isTruthy / isFalsy"
					},
					{
						id: "notyetimplemented",
						title: "Props: set"
					},
					{
						id: "notyetimplemented",
						title: "Props: load"
					},
					{
						id: "notyetimplemented",
						title: "Props: remove"
					},
					{
						id: "notyetimplemented",
						title: "Props: clear"
					},
					{
						id: "notyetimplemented",
						title: "Props: modify"
					},
					{
						id: "notyetimplemented",
						title: "Props: mirror"
					},
					{
						id: "notyetimplemented",
						title: "Props: extend inheritance"
					},
					{
						id: "notyetimplemented",
						title: "Props: child override"
					},
					{
						id: "notyetimplemented",
						title: "Props: $locked directive"
					},
					{
						id: "notyetimplemented",
						title: "Props: $pinned directive"
					},
					{
						id: "notyetimplemented",
						title: "Props: lock (forthcoming)"
					},
					{
						id: "notyetimplemented",
						title: "Props: pin (forthcoming)"
					},
					{
						id: "notyetimplemented",
						title: "Props: getWithFallback chain"
					},
					{
						id: "notyetimplemented",
						title: "Props: addObserver"
					},
					{
						id: "notyetimplemented",
						title: "Props: addPropertyObserver"
					},
					{
						id: "notyetimplemented",
						title: "Props: addFallbackObserver"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: event click"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: event blur/keyup/change"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: params (c-name-param)"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: custom registration"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: element specialization (:input vs :*)"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: missing behavior error"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: multiple on one element"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: ROOT_PROHIBITED"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: CHILD_CONSUMPTION_PROHIBITED"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: prefix override affects behaviors"
					},
					{
						id: "notyetimplemented",
						title: "Behavior: lifecycle hooks"
					},
					{
						id: "notyetimplemented",
						title: "Digest: value binding to DOM"
					},
					{
						id: "notyetimplemented",
						title: "Digest: manual sync()"
					},
					{
						id: "notyetimplemented",
						title: "Digest: parent to child adjacency"
					},
					{
						id: "notyetimplemented",
						title: "Digest: child to parent adjacency"
					},
					{
						id: "notyetimplemented",
						title: "Digest: array in-place mutation"
					},
					{
						id: "notyetimplemented",
						title: "Digest: object in-place mutation"
					},
					{
						id: "notyetimplemented",
						title: "Digest: convergence (watch mutates model)"
					},
					{
						id: "notyetimplemented",
						title: "Digest: maxEvaluations guard"
					},
					{
						id: "notyetimplemented",
						title: "Digest: trigger via set"
					},
					{
						id: "notyetimplemented",
						title: "Digest: trigger via invoke"
					},
					{
						id: "notyetimplemented",
						title: "Digest: trigger via message"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send GLOBALLY"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send CONTEXT"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send DESCENDANTS"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send IMMEDIATE_CHILDREN"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send IMMEDIATE_CHILD_COMPONENTS"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send PARENT"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send PARENTS"
					},
					{
						id: "notyetimplemented",
						title: "Msg: send ROOT"
					},
					{
						id: "notyetimplemented",
						title: "Msg: startFrom path"
					},
					{
						id: "notyetimplemented",
						title: "Msg: message() direct"
					},
					{
						id: "notyetimplemented",
						title: "Msg: channel namespacing"
					},
					{
						id: "notyetimplemented",
						title: "Msg: onMessage subscribe"
					},
					{
						id: "notyetimplemented",
						title: "Msg: onMessage forChannel"
					},
					{
						id: "notyetimplemented",
						title: "Msg: Transmitter injection"
					},
					{
						id: "notyetimplemented",
						title: "Msg: Receiver injection"
					},
					{
						id: "notyetimplemented",
						title: "X-cut: strict mode enabled"
					},
					{
						id: "notyetimplemented",
						title: "X-cut: strict mode message"
					},
					{
						id: "notyetimplemented",
						title: "X-cut: styles enabled"
					},
					{
						id: "notyetimplemented",
						title: "X-cut: framework coexistence (prefix)"
					},
					{
						id: "notyetimplemented",
						title: "X-cut: metadata()"
					},
					{
						id: "notyetimplemented",
						title: "X-cut: override window"
					},
					{
						id: "notyetimplemented",
						title: "Filter: createFilter"
					},
					{
						id: "notyetimplemented",
						title: "Filter: withPredicate"
					},
					{
						id: "notyetimplemented",
						title: "Filter: withSort"
					},
					{
						id: "notyetimplemented",
						title: "Filter: withLimit"
					},
					{
						id: "notyetimplemented",
						title: "Filter: paged navigation"
					},
					{
						id: "notyetimplemented",
						title: "Filter: limit/offset"
					},
					{
						id: "notyetimplemented",
						title: "Machine: states"
					},
					{
						id: "notyetimplemented",
						title: "Machine: transitions"
					},
					{
						id: "notyetimplemented",
						title: "Machine: transition guard"
					},
					{
						id: "notyetimplemented",
						title: "Machine: MachineState model"
					},
					{
						id: "notyetimplemented",
						title: "Interval: onInterval fires"
					},
					{
						id: "notyetimplemented",
						title: "Interval: onInterval cleared on unmount"
					},
					{
						id: "notyetimplemented",
						title: "Element: forElement focus"
					},
					{
						id: "notyetimplemented",
						title: "Element: forElement blur"
					},
					{
						id: "notyetimplemented",
						title: "Form: forForm submit"
					},
					{
						id: "notyetimplemented",
						title: "Form: forForm requestSubmit"
					},
					{
						id: "notyetimplemented",
						title: "Form: forForm reset"
					},
					{
						id: "notyetimplemented",
						title: "Form: forForms multiple"
					},
					{
						id: "notyetimplemented",
						title: "Watch: onExpressionValueChange"
					},
					{
						id: "notyetimplemented",
						title: "Watch: evaluate expression"
					},
					{
						id: "notyetimplemented",
						title: "Watch: getWatchScope"
					},
					{
						id: "notyetimplemented",
						title: "Log: level threshold filtering"
					},
					{
						id: "notyetimplemented",
						title: "Log: appender routing"
					},
					{
						id: "notyetimplemented",
						title: "Log: if-level lazy eval"
					},
					{
						id: "notyetimplemented",
						title: "Log: .DISABLED per logger"
					}
				]
			}
		];
		this.activeItem = "intro";
	}

	public onMount(): void {
		this.$c().regions().setByObjectId("body", "/specimens/intro");		
	}

	public show(name: string): void {
		this.activeItem = name;
		this.$c().regions().setByObjectId("body", "/specimens/../specimens/" + name);
	}

}

export default SpecimensHome;
