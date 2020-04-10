
# <a id="entrytitle">[Cydran](https://github.com/cydran/cydran)</a>
An unobtrusive Javascript presentation framework.

## Concepts
Code examples in this documentation are based in [Typescript](https://www.typescriptlang.org) (typed superset of JavaScript that compiles to plain JavaScript), but are equally demostrable in [Javascript/ES5](https://en.wikipedia.org/wiki/ECMAScript#5th_Edition) or better.  Furthermore, terminology common to web development, such as DOM (document object model) is included and assumed understood.  Such term definitions not explictly defined are easility available from many internet sources.

* <a id="concept:pubsub">***PubSub***</a> - scoped (global, [module](#concept:module), [component](#concept:component)) inter-process publication/subscription communication channels.  References to the PubSub object are singleton/static in nature. PubSub is always accessible by default in Cydran [components - (see the constructor)](#concept:component.ex1).  Explicit access to PubSub is to allow objects and script participation external to Cydran to occur. Management of the PubSub resource requires non Cydran components/participants to know how to clean up after themselves to remove any static references that may have been created through PubSub.enableGlobal() and PubSub.disableGlobal() method calls.
* <a id="concept:stage">***Stage***</a> - a Cydran region of work/influence identified by a CSS selector expression within the DOM. Content is determined by Cydran [compoenents](#concept:component).  See ``this.setComponent(new CydranComponent()`` below.  A Cydran stage is created through the builder pattern using a static instance of the StageBuilder.

		import { builder, Stage } from "cydran";

		builder("body")
			.withDebugLogging()
			.withSingleton("someSvc", SomeSvc)
			.withScopeItem("globalFn", (key?: string) => {})
			.withCapability(describedCapability)
			.withInitializer((stage: Stage) => {
				// this.setComponent(new HomeView());
				stage.setComponentFromRegistry("pg:home");
				const router: Router = stage.get("router");
				router.start();
			})
			.build()
			.start();

* <a id="concept:module">***Module***</a> - a grouping of related objects/code providing "black box" boundary use in the provision and use of services and [components](#concept:component) within Cydran.  A Cydran module is defined as follows:

		const module: Module = builder.getModule("<namespace>");
		module.registerPrototype("<svc_identifier>", SomeObjOrRef);
		module.associate(SomeObjOrRef);
* <a id="concept:component">***Component***</a> - Cydran components are intended to be declarative, non-conflicting units of UI/UX functionality that will ***NOT*** produce any unintended side-effects; a functionally practical "black box".
		<a id="concept:component.ex1">

		const TEMPLATE = "<div>... markup here ...</div>";
		class App extends Cydran.Component {

			private count: number = 0;

			constructor() {
				super(TEMPLATE);
				this.on("msgType").forChannel("name").invoke(this.someMethod);
			}

			// Use of init allows for .reset() of component to initial state
			// Invocation during the super(TEMPLATE) call phase of the constructor
			init() {
				this.count = 0;
				this.msg = "";
			}

			someMethod() {
				this.count++;
			}
		}
		</a>
* <a id="concept:model">***Model***</a> - programatic representation of a Cydran [component](#concept:component).  Access to the model is granted through [template](#exp:model) markup, fully qualified/valid [expressions](#exp), and by the ``this`` keyword in a [programmatic](#concept:component.ex1) context.
* <a id="concept:mvvm">***[Mvvm](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)***</a> - abstracted base model functional implementation for Cydran.  Mvvm instances are assigned to each [binding representation ](#markup)in Cydran templates.  No direct/programatic access is allowed.
* <a id="concept:elemmed">***ElementMediator***</a> - functionality used by [Mvvm](#concept:mvvm) to reflect desired changes in the DOM.  Element mediators are the means of behavioral encapsulation and extension without alteration of the framework internals. An example might be to include markdown as part of a [component](#concept:component).
* <a id="concept:modmed">***ModelMediator***</a> - functionality used by [Mvvm](#concept:mvvm) to reflect desired changes in the [model](#concept:model) of the Cydran [component](#concept:component)
* <a id="concept:events">***Events***</a> - [Template](#concept:markup) [events](#exp:on) are defined by the standard Javascrpt events supported in the browser/client of choice. There exist also Cydran [lifecycle](#lifecycle) events used in the development of custom Cydran based [components](#concept:component) or [element mediators](#concept:elemmed).
* <a id="concept:markup">***templates***</a> are the visual representation of a Cydran [component](#concept:component).  Templates must be represented as strings containing valid HTML, including cydran [tags](#concept:tags) and [expression](#exp) declarations, at the time of component instantiation with a single restriction that the template representation have one (1) root node/element.  Comment nodes will be ignored.  Component template references by tag may also be represented in HTML ``<template>`` tags with the content of those tagas following the same single top-level element restriction.

		> some_template.html
		<div>
			... other markup here
		</div>

	or

		> some_template2.html
		<html>
			<head>
				<title>Something 2</title>
			</head>
			<body>
				... other markup here
				<pfx:component name="zyx"></pfx:component>
			</body>

			<template id="something">
				<div>more markup here</div>
			</template>
		</html>

	or

		> some_template3.html
		<div>
			... other markup here
			<div pfx:repeat="m().list" pfx:repeat:mode="auto">
				<template type="item">
					<!-- comment nodes allowed -->
					<pfx:component name="zyx"></pfx:component>
				</template>
			</div>

			... and more markup here
			<div pfx:repeat="m().list" pfx:repeat:mode="auto">
				<template type="item">
					<span>{{i()}}</span>
				</template>
			</div>
		</div>
It is the responsiblity of the developer to retrieve and provide the string representation of the template.  Examples below:

		* const TEMPLATE = document.querySelector("template[id=name]").innerHTML;
		* const TEMPLATE = "<div>[more markup here]</div>";
		* const TEMPLATE = doJavascriptCallThatReturnsString();

Use of a <a href="#tag:component">``<pfx:component>``</a> tag as the root in a [pfx:repeat](#exp:repeat) ``<template>`` context has special significance in how ``i()`` is passed and referenced in the component.

## <a id="concept:prefix">[Prefix](#concept:markup)</a>
#### *The default namespace declaration in Cydran based HTML templates is "c:".*

This may be overridden through the use of ``ComponentConfig.withPrefix(prefix: string)`` but is not recommended without a full understanding of the ramifications and side-effects of doing so.  This documentation will ***NOT*** detail those particular issues.  Documentation references will show ``pfx:`` in examples with an implied and clear reference to the internal default Cydran prefix declaration.

All Cydran tag and attribute uses are referrant to the declared namespace of the originating component; defaulting to the originating Cydran internal namespace, unless explicitly specified otherwise.  Third party and unofficial components may use the default namespace as long as all component identifiers are unique and distinctive from reserved names and identifiers within Cydran.  ***Attempting to use a Cydran reserved identifier for 3rd party components will result in an Error produced within Cydran while logged to the console, and the registration and use of the component disallowed.***  It is important to note that reserved identifiers are, by design and intent, uncomomn in their formulation and should not present any difficulty to 3rd party developers in their respective coding activities.

### <a id="concept:tags">[Cydran HTML Tags](#concept:markup)</a>
There are 2 custom markup/html tags in Cydran.  Cydran HTML tags must have  a declared closing tag to funtion properly, much like using a standard HTML ``<script></script>`` reference.  A self-closing tag, such as ``<br />``, is not supported. Any content specified or declared between the open and closing tags will be ignored.

* <a id="tag:region">***pfx:region***</a> - DOM node representation of a region in a Cydran template that acts as a placeholder for programmatic substitution with instantiated [components](#concept:component) as an ongoing replaceable structural element in and of the applicaiton.  As with the [pfx: component](#tag:component) tag, this is a structural representation concern.

		<pfx:region name="xyz"></pfx:region>
* <a id="tag:component">***[pfx:component](#concept:component)***</a> - DOM node representation of a component placeholder in a Cydran template requiring a static structural reference to an instantiated [component](#concept:component).  This does ***not*** presume that the [component](#concept:component) is sterile in its exhibited behaviors and interactions.  As with the [pfx:region](#tag:region) tag, this is a structural representation concern.

		<pfx:component name="zyx"></pfx:component>

### <a id="concept:attribute">[Cydran HTML Attributes](#concept:markup)</a>
All Cydran attribute values are evaluated as expression of work in a "truthy" context of the attribute value.

* <a id="exp:custom">***pfx:[custom]***</a> - use of custom [ElementMediator](#concept:elemmed) functionality

		<div pfx:markdown="m().mdvalue"></div>
* <a id="exp:on">***pfx:on[event]***</a> - support of any/all event types is determined by the hardware and browser of the runtime platform.

		<input type="text" pfx:onblur="m().doWork()" value="{{m().variable}}"></input>
* <a id="exp:property">***pfx:property-[name]***</a>- expose a [component](#concept:component) member to external examination/calls/binding

		<pfx:component name="xyz" pfx:property-theColor="m().color"></pfx:component>
* <a id="exp:checked">***pfx:checked***</a>- Will the form element (usually radio or checkbox) express a checked status

		<input type="checkbox"
			pfx:checked="!m().lineEditable"
			pfx:onchange="m().toggleLineEditable()" />
* <a id="exp:class">***pfx:class***</a>- The named class (ie. populated) will be added to the HTML "class" attribute if the expression (ie. m().items.length > 0) evaluates "truthy"

		<ul pfx:class="{populated: m().items.length > 0}"></ul>
* <a id="exp:class">***pfx:enabled***</a>- HTML "enabled" boolean attribute added or removed based on expression evaluation

		<button pfx:onclick="m().load()" pfx:enabled="!m().loading">Run</button>
* <a id="exp:class">***pfx:readonly***</a> -

		<input type="text"
			pfx:readonly="!m().lineEditable"
			pfx:model="m().address.postalCode" />
* <a id="exp:style">***pfx:style***</a> - CSS style as expressed in evaluated expression inserted into local HTML "style" attribute.

		<div class="container column"
			pfx:style="{border: '1px solid', borderColor: m().color}"></div>
* <a id="exp:forcefocus">***pfx:force-focus***</a> - force focus on a specific DOM element.

		<input type="text" pfx:force-focus="m().focusForced">
* <a id="exp:model">***pfx:model***</a> - Any modification of the value of the input type will be propagated to the model and visa versa.  Model representations with more than one possible value, such as a multi-select list, should be represented as an Array object.  (See [repeat](#exp:repeat) and [item](#exp:item))

		<input type="text" pfx:model="m().post.title" />
* <a id="exp:visible">***pfx:visible***</a> - The parent node will be marked "visible" (html boolean attribute) based on the evaluation of the attribute value.

		<span pfx:visible="m().name.nick.length > 0">{{m().name.nick}}<br /></span>
* <a id="exp:if">***pfx:if***</a> - Certain user stories may express requirements that exceed the capability of default HTML visble or hidden attributes.  Removal of a node from the DOM may be desireable while maintaining a reference/bookmark to desired location of placement if circumstances change.

		<div pfx:if="!m().hideImage"><img src="pathtoimg.jpg" /></div>
* <a id="exp:repeat">***pfx:repeat***</a> - Repeating Cydran stuctures can be expressed with conditions of empty data, a special first position value, and the standard structure for each item.  The only required template type is "item".  Available template types include: empty, first, item, after, and alt.  Template content must have a single top level element.  A single ``<pfx:component name="itemComponent"></pfx:component>`` declaration may be used in lieu of additional markup.

		<select pfx:repeat="m().items"
			pfx:repeat:mode="field"
			pfx:model="m().selectedDropdownOption">
			<template type="empty">
				<pfx:component name="disabledOption"></pfx:component>
			</template>
			<template type="first">
				<option disabled selected>Select One...</option>
			</template>
			<template type="item">
				<option value="{{item().id}}">{{item().title}}</option>
			</template>
		</select>

	* <a id="exp:repeat:mode">***pfx:repeat:mode***</a> - **Required** attribute indicating the repeat mode/strategy of a list as indicated by reserved word:
		* <a id="exp:repeat:mode:none">***none***</a>: The repeat item data source context is assumed to have an ``id`` attribute with a unique value.  Any context lacking the ``id`` field will log an Error but continue to render unless otherwise specified with an [pfx:repeat:idkey](#exp:repeat:idkey) attribute.  Such a circumstance may produce unexpected behaviors in the ``pfx:repeat`` render portion of the component and other adverse artifacts.  Use of [pfx:repeat:idkey](#exp:repeat:idkey) will cause the ``id`` field reference named to be used instead.
		* <a id="exp:repeat:mode:generated">***generated***</a>: An identity reference will be added to the current item structure with the field name of ``id`` if not already extant with a v4 uuid value.  Unique enforcement is _ONLY_ applied to the expectation of generated id's and _NOT_ to potential conflicts arrising from items of the context or list that already have an id field present.
		* <a id="exp:repeat:mode:expression">***expression***</a>: a computed identity value is to be derived from the repeat item itself with a provided expression.  Such a strategy becomes neccessary with lists of primitives or other lists of objects where an non-extant id attribute composited into the existing data structure is disallowed or undesireable.

	* <a id="exp:repeat:idkey">***pfx:repeat:idkey***</a> - **Optionally Required** attribute if designated/desired id field name is other than "id".  Applies to [none](#exp:repeat:mode:none) and [generated](#exp:repeat:mode: generated) modes of [pfx:repeat](#exp:repeat) operations

			<select pfx:repeat="m().items"
				pfx:repeat:mode="none|generated"
				pfx:repeat:idkey="xyz"
				pfx:model="m().selectedDropdownOption">
				...
			</select>
	* <a id="exp:repeat:expression">***pfx:repeat:expression***</a> - **Contextually Required** attribute if [pfx:repeat:mode](#exp:repeat:mode) indicates "expression" with a computed id value within the [pfx:repeat](#exp:repeat) item context.

			<select pfx:repeat="m().items"
				pfx:repeat:mode="expression"
				pfx:repeat:expression="i()"
				pfx:model="m().selectedDropdownOption">
				...
			</select>

## <a id="exp">[Expressions](#concept:markup)</a>
An expression in Cydran **is** any valid Javascript expression that results in a value, object field reference, or functional invocation. The Javascript ``strict`` keyword is universally utilized and enforced.  Cydran expressions are used in specific [element mediators](#concept:elemmed) and within [curly brace](#exp:anonymous) contexts.

## <a id="exp:core">[Core Expresive Functions](#concept:markup)</a>
* <a id="exp:anonymous">{{}} (double brace expression)</a> - anonymous reference in a Cydran [template](#concept:markup) containing a valid Javascript (JS) expression with the expectation of a return value to be represented in the visible render of the active [component](#concept:component).

		<div>{{ m().data.value1 }}</div>
	* <a id="exp:model">model()</a> - reference to the defined members and functions/methods of the Cydran component model.  This may also may be expressed with m() - its [alias form](#exp:model.abbrev).

			<input type="text"
				pfx:onblur="model().doWork()"
				value="{{m().variable}}"></input>
	* <a id="exp:model.abbrev">m()</a> - alias for [model()](#exp:model)
	* <a id="exp:item">item()</a> - reference to the model array item within a [repeating](#exp:repeat) context.  This may also may be expressed with i() - its [alias form](#exp:item.abbrev).

			<template type="item">
				<option value="{{i().id}}">{{item().title}}</option>
			</template>
	* <a id="exp:item.abbrev">i()</a> - alias for [item()](#exp:item)
	* <a id="exp:external">external()</a> - access to the explicitly accessible portion of a model.  This may also may be expressed with e() - its [alias form](#exp:external.abbrev).

			<button class="button"
				pfx:onclick="console.log(external())">
				Do Work
			</button>
	* <a id="exp:external.abbrev">e()</a> - alias for [external()](#exp:external)


## <a id="lifecycle">Lifecycle Events</a>
By category:

* [PARENT - Before](#lifecycle:parent.before)
* [PARENT - After](#lifecycle:parent.after)
* [CHILD - Before](#lifecycle:child.before)
* [CHILD - After](#lifecycle:child.after)
* [OTHER](#lifecycle:other)

### <a id="lifecycle:parent.before">PARENT - Before</a>
* ``Events.BEFORE_PARENT_ADDED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent is set in component when prior parent was null

* ``Events.BEFORE_PARENT_CHANGED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent set regardless of prior or new parent being null

* ``Events.BEFORE_PARENT_REMOVED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: Parent is set null when prior parent was non-null

### <a id="lifecycle:parent.after">PARENT - After</a>
* ``Events.AFTER_PARENT_ADDED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent is set in component when prior parent was null

* ``Events.AFTER_PARENT_CHANGED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent set regardless of prior or new parent being null

* ``Events.AFTER_PARENT_REMOVED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: Parent is set null when prior parent was non-null

### <a id="lifecycle:child.before">CHILD - Before</a>
* ``Events.BEFORE_CHILD_ADDED``
	* Recipient: Component whose child has changed
	* Occurs: Before state change occurrence
	* Significance: New child component is set where child within affected region was null

* ``Events.BEFORE_CHILD_CHANGED``
	* Recipient: Component whose child has changed
	* Occurs: Before state change occurrence
	* Significance: New child component is set regardless of prior region population

* ``Events.BEFORE_CHILD_REMOVED``
	* Recipient: Component whose child has changed
	* Occurs: Before state change occurrence
	* Significance: Child is set null when prior child was non-null

### <a id="lifecycle:child.after">CHILD - After</a>
* ``Events.AFTER_CHILD_ADDED``
	* Recipient: Component whose child has changed
	* Occurs: After state change occurrence
	* Significance: New child component is set where child within affected region was null

* ``Events.AFTER_CHILD_CHANGED``
	* Recipient: Component whose child has changed
	* Occurs: After state change occurrence
	* Significance: New child component is set regardless of prior region population

* ``Events.AFTER_CHILD_REMOVED``
	* Recipient: Component whose child has changed
	* Occurs: After state change occurrence
	* Significance: Child is set null when prior child was non-null

### <a id="lifecycle:other">Other</a>
* ``Events.COMPONENT_NESTING_CHANGED``
	* Recipient: Global
	* Occurs: When the nesting of components is changed
	* Significance: When the nesting of components is changed.  This should be very infrequently.

* ``Events.BEFORE_DISPOSE``
	* Recipient: Component upon which the event occurred
	* Occurs: Before disposal of component
	* Significance: Last gasp of component (requisite clean-up)
