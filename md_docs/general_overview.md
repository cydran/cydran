
# [Cydran](https://github.com/cydran)
An unobtrusive Javascript presentation framework.

## Concepts
* <a id="con:pubsub">***PubSub***</a> - scoped (global, [module](#con:module), [component](#con:component)) inter-process publication/subscription communication channels.  References to the PubSub object are singleton/static in nature.  PubSub is accessible by default in cydran [components](#con:component.ex1) - see the constructor.
* <a id="con:stage">***Stage***</a> - [cydran](https://github.com/cydran) region of work/influence identified by a CSS selector expression within the DOM. Content is determined by cydran [compoenents](#con:component) (See this.setComponent(new CydranComponent()) below).  A cydran stage is created through the builder pattern using a static instance of the StageBuilder.

		builder("body")
			.withDebugLogging() // logging level
			.withSingleton('someSvc', SomeSvc) // service object
			.withScopeItem('globalFn', (key: string) => workDone) // global function registration
			.withCapability(describedCapability) // formerly described capability function
			.withInitializer(function () { // not executed until DOM is loaded
			this.setComponent(new CydranComponent()); // general set-up and config
		})
		.build() // build the cydran stage
		.start(); // start the stage/play`
* <a id="con:module">***Module***</a> - a grouping of related objects/code providing "black box" boundary use in the provision and use of services and [components](#con:component) within cydran.  A cydran module is defined as follows:

		const module: Module = builder.getModule("<namespace>");
		module.registerPrototype("<svc_identifier>", SomeObjOrRef);
		module.associate(SomeObjOrRef);
* <a id="con:component">***Component***</a> - cydran components are intended to be declarative, non-conflicting units of UI functionality that will ***NOT*** produce any unintended side-effects; a functionally practical "black box".

		const TEMPLATE = "<div>... markup here ...</div>";
		class App extends cydran.Component {
	
			constructor() {
				super(TEMPLATE);
				this.on("msgType").forChannel("name").invoke(this.someMethod);
			}
			
			// use of init allows for .reset() of component to initial state
			init() {
				this.count = 0;
				this.msg = "";
			}
			
			someMethod() {
				this.count++;
			}
		}
* <a id="con:model">***Model***</a> - programatic representation of a [cydran](https://github.com/cydran) [component](#con:component).  Access to the model is through [template markup](#exp:model) and by reference in a cydran [components](#con:component.ex1).
* <a id="con:mvvm">***[Mvvm](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)***</a> - abstracted base model functional implementation for [cydran](https://github.com/cydran).  Mvvm instances are assigned to each [binding representation ](#markup)in cydran templates.  No direct/programatic access is allowed.
* <a id="con:elemmed">***ElementMediator***</a> - functionality used by [Mvvm](#con:mvvm) to reflect desired changes in the DOM.  Element mediators are the means of behavioral encapsulation and extension without alteration of the framework internals. An example would be to include markdown in the [component](#con:component).
* <a id="con:modmed">***ModelMediator***</a> - functionality used by [Mvvm](#con:mvvm) to reflect desired changes in the [cydran](https://github.com/cydran) model of the [component](#con:component)
* <a id="con:events">***Events***</a> - [Template](#con:markup) [events](#exp:on) are defined by the standard Javascrpt events that are supported by the browser client of choice. There exist also cydran [lifecycle](#lifecycle) events used in the development of custom cydran based [components](#con:component) or [element mediators](#con:elemmed).
* <a id="con:markup">***templates***</a> are the visual representation of a cydran [component](#con:component).  Templates must be represented as strings containing valid HTML at the time of component instantiation with a single restriction that the template have a single root node/element.  Component templates may also be represented in HTML &lt;template&gt; tags with the content following the same single top-level element restriction.


		<div>other markup here</div>
		
		or
		
		<template id="something">
			<div>markup here</div>
		</template>
It is the responsiblity of the developer to retrieve and provide the string representation of the template.  The following may be one method to accomplish that task:

		const TEMPLATE = document.querySelector("template[id=name]").innerHTML;

## [Prefix](#con:markup)
The default cydran namespace use declaration in HTML templates is with **"c:"**.  This may be overridden through the use of ComponentConfig.withPrefix(prefix:string), but not recommended without a full understanding of the ramifications and side-effects of doing so.  This documentation will ***NOT*** detail those particular issues.

All cydran tag and attribute uses are referrant to the declared namespace of the originating component; usually within the originating cydran "c:" namespace, unless explicitly specified otherwise, as noted above.  Third party and unofficial components may use the default namespace as long as all [component](#con:component) identifiers are unique and distinctive from reserved names and ids within cydran.  Attempting to use a reserved identifier will result in an Error produced within cydran and the registration of the component disallowed.

## [Tags](#con:markup)
There are 2 custom supported tags in cydran:

* <a id="tag:region">***c:region***</a> - DOM node representation of a region in cydran template

		<c:region name="xyz"></c:region>
* <a id="tag:component">***[c:component](#con:component)***</a> - DOM node representation of a component in cydran template

		<c:component name="zyx"></c:component>

## [Attributes](#con:markup)
All cydran attribute values are evaluated as expression of work in a "truthy" context of the attribute value.

* <a id="exp:custom">***c:[custom]***</a> - use of custom [ElementMediator](#con:elemmed) functionality
	
		<div c:markdown="m().mdvalue"></div>
* <a id="exp:on">***c:on[event]***</a> - support of any/all event types is determined by the hardware and browser of the runtime platform.

		<input type="text" c:onblur="m().doWork()" value="{{m().variable}}"></input>
* <a id="exp:property">***c:property-[name]***</a>- expose a [component](#con:component) member to external examination/calls/binding

		<c:component name="xyz" c:property-theColor="m().color"></c:component>
* <a id="exp:checked">***c:checked***</a>- Will the form element (usually radio or checkbox) express a checked status

		<input type="checkbox" c:checked="!m().lineEditable" c:onchange="m().toggleLineEditable()" />
* <a id="exp:class">***c:class***</a>- The named class (ie. populated) will be added to the HTML "class" attribute if the expression (ie. m().items.length > 0) evaluates "truthy"

		<ul c:class="{populated: m().items.length > 0}"></ul>
* <a id="exp:class">***c:enabled***</a>- HTML "enabled" boolean attribute added or removed based on expression evaluation

		<button c:onclick="m().load()" c:enabled="!m().loading">Run</button>
* <a id="exp:class">***c:readonly***</a> - 

		<input type="text" c:readonly="!m().lineEditable" c:model="m().address.postalCode" />
* <a id="exp:style">***c:style***</a> - CSS style as expressed in evaluated expression inserted into local HTML "style" attribute.

		<div class="container column" c:style="{border: '1px solid', borderColor: m().color}"></div>
* <a id="exp:forcefocus">***c:force-focus***</a> - force focus on a specific DOM element.

		<input type="text" c:force-focus="m().focusForced">
* <a id="exp:model">***c:model***</a> - Any modification of the value of the input type will be propagated to the model and visa versa.  Model representations with more than one possible value, such as a multi-select list, should be represented as an Array object.  (See [repeat](#exp:repeat) and [item](#exp:item))

		<input type="text" c:model="m().post.title" />
* <a id="exp:visible">***c:visible***</a> - The parent node will be marked "visible" (html boolean attribute) based on the evaluation of the attribute value.

		<span c:visible="m().name.nick.length > 0">{{m().name.nick}}<br /></span>
* <a id="exp:if">***c:if***</a> - Certain user stories may express requirements that exceed the capability of default HTML visble or hidden attributes.  Removal of a node from the DOM may be desireable while maintaining a reference/bookmark to desired location of placement if circumstances change.

		<div c:if="!m().hideImage"><img src="pathtoimg.jpg" /></div>
* <a id="exp:repeat">***c:repeat***</a> - Repeating cydran stuctures can be expressed with conditions of empty data, a special first position value, and the standard structure for each item.  The only required template type is "item"
		
		<select c:repeat="m().items" c:model="m().selectedDropdownOption">
			<template type="empty">
				<option value="" disabled selected>Select your option</option>
			</template>
			<template type="first">
				<option disabled selected>Select One...</option>
			</template>
			<template type="item">
				<option value="{{item().id}}">{{item().title}}</option>
			</template>
		</select>
* <a id="exp:attrib:param">***c:&lt;attribute&gt;:&lt;param&gt;***</a> - Some cydran stuctures may require or be able to use additional information.  The parameter attribute is easily identified by it's structure as it appears like its releated attribute, such as c:repeat, but with an additional segment.  For repeat there is an :idkey that can be used, as illustrated below.
		
		<select c:repeat="m().items" c:model="m().selectedDropdownOption" c:repeat:idkey="recordIdFieldName">
			<template type="item">
				<option value="{{item().id}}">{{item().title}}</option>
			</template>
		</select>

		
## [Expressions](#con:markup)
An expression in cydran is a Javascrpit keyword expression. The Javascript "strict" keyword is utilized and enforced.  cydran expressions are used in specific [element mediators](#con:elemmed) and within [curly brace](#exp:anonymous) contexts.
		
## [Core Expresive Functions](#con:markup)
* <a id="exp:anonymous">{{}} (double brace expression)</a> - anonymous reference in a cydran [template](#con:markup) containing a valid Javascript (JS) expression with the expectation of a return value to be represented in the visible render of the active [component](#con:component).

		<div>{{ m().data.value1 }}</div>
* <a id="exp:model">model()</a> - reference to the defined members and functions/methods of the cydran component model.  This may also may be expressed with m() - its [alias form](#exp:model.abbrev).

		<input type="text" c:onblur="model().doWork()" value="{{m().variable}}"></input>
* <a id="exp:model.abbrev">m()</a> - alias for [model()](#exp:model)
* <a id="exp:item">item()</a> - reference to the model array item within a [repeating](#exp:repeat) context.  This may also may be expressed with i() - its [alias form](#exp:item.abbrev).

		<template type="item">
			<option value="{{i().id}}">{{item().title}}</option>
		</template>
* <a id="exp:item.abbrev">i()</a> - alias for [item()](#exp:item)
* <a id="exp:external">external()</a> - access to the explicitly accessible portion of a model.  This may also may be expressed with e() - its [alias form](#exp:external.abbrev).

		<button class="button" c:onclick="console.log(external())">Do Work</button>
* <a id="exp:external.abbrev">e()</a> - alias for [external()](#exp:external)


## <a id="lifecycle">Lifecycle</a>
By category:

* [PARENT - Before](#lc:parent.before)
* [PARENT - After](#lc:parent.after)
* [CHILD - Before](#lc:child.before)
* [CHILD - After](#lc:child.after)
* [OTHER](#lc:other)
	
### <a id="lc:parent.before">PARENT - Before</a>
* Events.BEFORE_PARENT_ADDED
	* Recipient: Component upon which the event occurred
	* When: After state change occurrence
	* Significance: New parent is set in component when prior parent was null

* Events.BEFORE_PARENT_CHANGED
	* Recipient: Component upon which the event occurred
	* When: After state change occurrence
	* Significance: New parent set regardless of prior or new parent being null

* Events.BEFORE_PARENT_REMOVED
	* Recipient: Component upon which the event occurred
	* When: After state change occurrence
	* Significance: Parent is set null when prior parent was non-null

### <a id="lc:parent.after">PARENT - After</a>
* Events.AFTER_PARENT_ADDED
	* Recipient: Component upon which the event occurred
	* When: After state change occurrence
	* Significance: New parent is set in component when prior parent was null

* Events.AFTER_PARENT_CHANGED
	* Recipient: Component upon which the event occurred
	* When: After state change occurrence
	* Significance: New parent set regardless of prior or new parent being null

* Events.AFTER_PARENT_REMOVED
	* Recipient: Component upon which the event occurred
	* When: After state change occurrence
	* Significance: Parent is set null when prior parent was non-null

### <a id="lc:child.before">CHILD - Before</a>
* Events.BEFORE_CHILD_ADDED
	* Recipient: Component whose child has changed
	* When: Before state change occurrence
	* Significance: New child component is set where child within affected region was null

* Events.BEFORE_CHILD_CHANGED
	* Recipient: Component whose child has changed
	* When: Before state change occurrence
	* Significance: New child component is set regardless of prior region population

* Events.BEFORE_CHILD_REMOVED
	* Recipient: Component whose child has changed
	* When: Before state change occurrence
	* Significance: Child is set null when prior child was non-null

### <a id="lc:child.after">CHILD - After</a>
* Events.AFTER_CHILD_ADDED
	* Recipient: Component whose child has changed
	* When: After state change occurrence
	* Significance: New child component is set where child within affected region was null

* Events.AFTER_CHILD_CHANGED
	* Recipient: Component whose child has changed
	* When: After state change occurrence
	* Significance: New child component is set regardless of prior region population

* Events.AFTER_CHILD_REMOVED
	* Recipient: Component whose child has changed
	* When: After state change occurrence
	* Significance: Child is set null when prior child was non-null

### <a id="lc:other">Other</a>
* Events.COMPONENT_NESTING_CHANGED
	* Recipient: Global
	* When: When the nesting of components is changed
	* Significance: When the nesting of components is changed.  This should be very infrequently.
	
* Events.BEFORE_DISPOSE
	* Recipient: Component upon which the event occurred
	* When: Before disposal of component
	* Significance: Last gasp of component (requisite clean-up)