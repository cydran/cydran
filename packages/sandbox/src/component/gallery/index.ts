import { argumentsBuilder, Context } from "@cydran/cydran";
import Intro from "./Intro";
import Validation from "./Validation";
import Regions from "./Regions";
import InlineComponent from "./regions/InlineComponent";
import RadioButtons from "./RadioButtons";
import MultiSelects from "./MultiSelects";
import SharedModel from "./SharedModel";
import ReadOnly from "./ReadOnly";
import Svg from "./Svg";
import CheckboxState from "./CheckboxState";
import Modals from "./Modals";
import WatchedField from "./WatchedField";
import FocusedEach from "./FocusedEach";
import Clock from "./Clock";
import WebComponentExample from "./WebComponentExample";
import FormElements from "./FormElements";
import Logging from "./Logging";
import TypedInputs from "./TypedInputs";

function galleryCapability(context: Context) {
	context.registerPrototype("intro", Intro);
	context.registerPrototype("regions", Regions);
	context.registerPrototype("validation", Validation);
	context.registerPrototype("radioButtons", RadioButtons);
	context.registerPrototype("multiSelects", MultiSelects);
	context.registerPrototype("sharedModel", SharedModel);
	context.registerPrototype("readOnly", ReadOnly);
	context.registerPrototype("svg", Svg);
	context.registerPrototype("checkboxState", CheckboxState);
	context.registerPrototype("modals", Modals);
	context.registerPrototype("watchedField", WatchedField);
	context.registerPrototype("focusedEach", FocusedEach);
	context.registerPrototype("clock", Clock);
	context.registerPrototype("inline", InlineComponent);
	context.registerPrototype("webComponentExample", WebComponentExample);
	context.registerPrototype("formElements", FormElements);
	context.registerPrototype("typedInputs", TypedInputs);
	context.registerPrototype("logging", Logging, argumentsBuilder().withLogger("testLogger").build());
}

export { galleryCapability };
