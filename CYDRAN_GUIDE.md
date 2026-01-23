# Cydran Framework Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Getting Started](#getting-started)
4. [Components](#components)
5. [Templates](#templates)
6. [Data Binding](#data-binding)
7. [Messaging & Communication](#messaging--communication)
8. [Dependency Injection](#dependency-injection)
9. [Lifecycle Hooks](#lifecycle-hooks)
10. [Advanced Features](#advanced-features)
11. [Best Practices](#best-practices)

---

## Overview

**Cydran** is an unobtrusive JavaScript/TypeScript MVVM (Model-View-ViewModel) presentation framework designed for building interactive web applications. This project uses a simple Hello World component to demonstrate:

- **Declarative UI**: HTML templates with data binding
- **Component-Based Architecture**: Reusable, self-contained components
- **MVVM Pattern**: Clear separation of concerns
- **Message-Driven Communication**: Decoupled component interactions
- **Dependency Injection**: Built-in IoC container

The framework is lightweight and can be used in applications ranging from simple to complex.

---

## Core Concepts

### MVVM Pattern

Cydran follows the Model-View-ViewModel pattern:

- **Model**: Plain data objects (e.g., component fields)
- **View**: HTML templates with binding expressions
- **ViewModel**: Component classes that manage state and logic

### Components

Components are the building blocks of Cydran applications. A component encapsulates:
- A template (HTML)
- A view model (JavaScript/TypeScript class)
- Lifecycle management
- Event handling and data binding

### Two-Way Data Binding

Changes to model properties automatically update the view, and user interactions update the model.

---

## Getting Started

### Basic Setup (This Project)

```javascript
// Helper function to retrieve template HTML
const template = (id) => {
  const templateElement = document.querySelector(`template[id="${id}"]`);
  return templateElement ? templateElement.innerHTML.trim() : '';
};

// Hello World Component
class HelloWorld extends cydran.Component {
  constructor() {
    super(template('hello-world'));

    this.greeting = 'Hello World!';
    this.message = 'Welcome to cydran Framework';
    this.clickCount = 0;
    this.messageShown = false;

    this.$c().onMessage('hideMessage')
      .forChannel('APP')
      .invoke(() => this.hideMessage());
  }

  updateGreeting() {
    this.clickCount++;
    if (this.clickCount === 1) {
      this.greeting = 'Great! You clicked the button!';
    } else if (this.clickCount === 5) {
      this.greeting = 'Wow, you really like clicking!';
    } else if (this.clickCount === 10) {
      this.greeting = 'You are a master clicker!';
    }
  }

  showMessage() {
    if (this.messageShown) {
      return;
    }

    this.$c().regions().setByObjectId('messageRegion', 'simpleMessage');
    this.messageShown = true;
  }

  hideMessage() {
    this.$c().regions().set('messageRegion', null);
    this.messageShown = false;
  }
}

// Simple message component
class SimpleMessage extends cydran.Component {
  constructor() {
    super(template('simple-message'));

    this.notice = 'Thanks for trying cydran!';
  }

  hideMe() {
    this.$c()
      .send('hideMessage')
      .onChannel('APP')
      .withPropagation(cydran.To.PARENT);
  }
}

// Root capability function - registers components
function rootCapability(context) {
  context.registerSingleton('app', HelloWorld);
  context.registerPrototype('simpleMessage', SimpleMessage);
}

// Create and start the cydran stage
const stage = cydran.create('#app', {}, rootCapability);
stage.addInitializer(null, s => {
  s.setComponentByObjectId('app');
});
stage.start();
```

### The Stage

The **stage** is the root container for your application:
- Created with `cydran.create(selector, properties, capabilityFunction)`
- Binds the component tree to the `#app` element in `index.html`
- Handles initialization and lifecycle

---

## Components

### Creating a Component

Components extend the `Component` class:

```javascript
class HelloWorld extends cydran.Component {
  constructor() {
    super(template('hello-world')); // Pass template HTML

    // Initialize properties
    this.greeting = 'Hello World!';
    this.message = 'Welcome to cydran Framework';
    this.clickCount = 0;
  }

  // Component methods
  updateGreeting() {
    this.clickCount++;
    if (this.clickCount === 1) {
      this.greeting = 'Great! You clicked the button!';
    } else if (this.clickCount === 5) {
      this.greeting = 'Wow, you really like clicking!';
    } else if (this.clickCount === 10) {
      this.greeting = 'You are a master clicker!';
    }
  }
}
```

### Component Context ($c())

Every component has access to a context object via `this.$c()` that provides:

| Method | Purpose |
|--------|---------|
| `getValue()` | Get the current value of the component's model |
| `onExpressionValueChange(expr, callback)` | Watch an expression for changes |
| `onMessage(msg).forChannel(channel).invoke(handler)` | Subscribe to messages |
| `getLogger()` | Get the logger instance |
| `getObject(name)` | Get a registered singleton from IoC container |
| `createFilter(expr).withPredicate(...).build()` | Create filtered arrays |
| `regions().set(name, component)` | Set/clear a named region |
| `regions().setByObjectId(name, objectId)` | Populate a region by prototype id |
| `regions().get(name)` | Get the component in a region (or null) |
| `regions().has(name)` | Check if a region exists |
| `forSeries(name)` | Access a series for list-like placement |

### Full $c() API (Reference)

The following methods are available on the component context:

| Method | Purpose |
|--------|---------|
| `getContext()` | Access the component’s IoC context |
| `getValue()` | Get the current model/value for this component |
| `getObject(name, ...args)` | Resolve an object from the IoC container |
| `getLogger()` | Get the component-scoped logger |
| `getEl()` | Get the root DOM element for this component |
| `getId()` | Unique runtime id for the component instance |
| `getName()` | Component name (often the class name) |
| `getParent()` | Parent component (or null at root) |
| `getPrefix()` | Binding prefix used by the template extractor |
| `getWatchScope()` | Watch scope for expression evaluation |
| `scope()` | Access the component’s template scope |
| `properties()` | Access runtime properties (`PropertyKeys` map) |
| `metadata()` | Access metadata storage helpers (`get`, `has`) |
| `onExpressionValueChange(expr, callback, [thisArg], [mutable])` | Watch expression changes and run a callback |
| `onMessage(messageName)` | Subscribe to messages (chain `.forChannel(...)`) |
| `onInterval(delayMs)` | Run a callback on a repeating interval |
| `send(messageName, [payload], [startFrom])` | Send a message (chain `.onChannel(...)`) |
| `tell(name, payload)` | Send an internal framework message |
| `sync()` | Trigger a digestion/sync cycle |
| `evaluate(expression)` | Evaluate an expression in component scope |
| `isMounted()` | Whether the component is currently mounted |
| `isConnected()` | Whether the component is connected in the tree |
| `regions()` | Access region APIs (set/get/has) |
| `forSeries(name)` | Access a `c-series` by name |
| `forElement(name)` | Access a named element registered via `c-id` |
| `forForm(name)` | Access a named form registered via `c-id` |
| `forForms()` | Access all forms registered on the component |
| `createFilter(expression)` | Build a reactive filtered collection |

### Regions() API

```
regions().has(name)
regions().get(name)
regions().set(name, componentOrNull)
regions().setByObjectId(name, objectId, [fallbackObjectId])
```

---

## Templates

### Template Definition

Templates are defined as HTML strings inside `<template>` elements:

```html
<template id="hello-world">
  <div class="container">
    <h1>{{m().greeting}}</h1>
    <p>{{m().message}}</p>
    <button c-onclick="m().updateGreeting()">Click Me!</button>
    <button c-onclick="m().showMessage()" c-enabled="!m().messageShown">Show Message</button>
    <p>Button clicked: {{m().clickCount}} times</p>
    <c-region name="messageRegion"></c-region>
  </div>
</template>

<template id="simple-message">
  <div class="simple-message">
    <p>{{m().notice}}</p>
    <button c-onclick="m().hideMe()">Hide Message</button>
  </div>
</template>
```

### Do Templates Need `<template>` Tags?

In this project, yes—templates live in `index.html` and are wrapped in `<template>` tags so they can be queried by id and converted into HTML strings at runtime. Cydran itself just needs a template string; it does not require that the source be a `<template>` element. You can load templates from elsewhere (inline strings, fetched HTML, etc.) as long as you pass a string to `super(...)`.

### Is `template()` a Cydran Function?

No. The `template()` helper used here is a project utility function that queries the DOM for a `<template>` by id and returns its inner HTML. Cydran does not provide this helper—you can implement your own template loader however you like.

### Retrieving Templates

Use a helper function to retrieve template HTML:

```javascript
const template = id =>
  document.querySelector(`template[id="${id}"]`).innerHTML.trim();

// Usage in component
super(template('hello-world'));
```

You can also align template ids to component names:

```javascript
const template = id =>
  document.querySelector(`template[id=${id}]`).innerHTML.trim();

class App extends Component {
  constructor() {
    super(template(App.name.toLowerCase()));
  }
}
```

### Template Syntax

#### Data Binding (`{{ }}`)
Interpolate expressions into the template:
```html
<h1>{{m().greeting}}</h1>
<p>{{m().message}}</p>
<p>Button clicked: {{m().clickCount}} times</p>
```

#### Property Binding (`c-model`)
Two-way binding to model properties:
```html
<input c-model="m().greeting">
<textarea c-model="m().message"></textarea>
```

#### Event Binding (`c-on*`)
Bind to DOM events:
```html
<button c-onclick="m().updateGreeting()">Click Me!</button>
<button c-onclick="m().showMessage()">Show Message</button>
<button c-onclick="m().hideMe()">Hide Message</button>
```

#### Conditional Rendering (`c-if`)
Show/hide elements based on conditions:
```html
<section c-if="m().clickCount > 0">
  <!-- Content shown only after a click -->
</section>
```

#### List Rendering (`c-each`)
Render lists of items:
```html
<ul c-each="m().messages" c-each-mode="none">
  <li>{{v()}}</li>
</ul>
```

#### Class Binding (`c-class`)
Dynamically apply CSS classes:
```html
<div c-class="{'highlight': m().clickCount > 0}">
```

#### Attribute Binding
```html
<input c-enabled="m().clickCount < 10">
<span c-enabled="m().clickCount < 10"></span>
```

#### Focus Management (`c-force-focus`)
```html
<input c-force-focus="m().clickCount === 0">
```

### c-region Modifiers

The `c-region` tag supports these modifiers (attributes):

| Attribute | Purpose | Notes |
|----------|---------|-------|
| `name` | Names the region so it can be targeted from code | If omitted, Cydran generates an anonymous region name |
| `path` | Requestable object path to a component in the IoC context | If set, the region auto-loads that component on mount |
| `value` | Expression to provide item/value context to the child component | Used as the region's item function (`setItemFn`) |
| `lock` | Locks the region from further updates | Boolean; if `true` updates to the region throw a LockedRegionError |

Notes:
- If `path` is set and `name` is not, the region is locked by default (cannot be changed later).
- `lock` is treated as a boolean attribute.

### Series Placement (c-series)

For multiple child components, use `c-series` plus `forSeries(...)`.

Template:
```html
<c-series name="items"></c-series>
```

Code placement APIs:
```javascript
const series = this.$c().forSeries('items');
series.insertFirst(component);
series.insertLast(component);
series.insertBefore(index, component);
series.insertAfter(index, component);
series.replace(oldComponent, newComponent);
series.replaceAt(index, component);
series.remove(component);
series.removeAt(index);
series.clear();
```

Notes:
- Series prevent duplicate components.
- `getAt(index)`, `contains(component)`, `hasComponents()`, and `isEmpty()` help inspect series state.

### Template Context Functions

Within templates, you can use:

| Function | Purpose | Example |
|----------|---------|---------|
| `m()` | Access view model | `m().greeting` |
| `v()` | Access component value (in iterators) | `v().title` |
| `s()` | Access scope functions | `s().pluralize('item', 3)` |
| `p()` | Access parameters (in event handlers) | `p().$event` |
| `c-region` | Named region placeholder | `<c-region name="messageRegion"></c-region>` |

---

## Data Binding

### Two-Way Binding

```html
<input c-model="m().title">
```

When the user types, the model updates. When the model updates programmatically, the view updates.

### Watched Expressions

Watch for changes to specific expressions:

```javascript
this.$c().onExpressionValueChange('m().clickCount', () => {
  // React to click count changes
});
```

You can also watch values inside iterators:

```javascript
this.$c().onExpressionValueChange('v().completed', () => {
  this.sendUpdate();
});
```

### Filtered Collections

Create filtered arrays with predicates:

```javascript
this.filtered = this.$c().createFilter('m().messages')
  .withPredicate("v().includes('click')", 'm().clickCount')
  .build();
```

In the template:
```html
<ul c-each="m().filtered.items()">
  <li>{{v()}}</li>
</ul>
```

---

## Messaging & Communication

### Message-Based Architecture

Components communicate through **channels** and **messages**, enabling loose coupling:

```javascript
// Define channel and message constants
const APP_CHANNEL = 'APP';
const CLICKED = 'Clicked';
const HIDE_MESSAGE = 'hideMessage';
```

### Sending Messages

Components send messages using the transmitter:

```javascript
// In a component
notifyClick() {
  this.txmitr.send(To.GLOBALLY, APP_CHANNEL, CLICKED, this.clickCount);
}
```

Send from a child component to its parent:

```javascript
this.$c()
  .send(HIDE_MESSAGE)
  .onChannel(APP_CHANNEL)
  .withPropagation(cydran.To.PARENT);
```

Send parameters:
- `To.GLOBALLY`: Send to all components
- `APP_CHANNEL`: Channel name
- `CLICKED`: Message name
- Data payload (can be any object)

### Receiving Messages

Subscribe to messages in the constructor:

```javascript
this.$c().onMessage(CLICKED)
  .forChannel(APP_CHANNEL)
  .invoke(count => {
    this.clickCount = count;
  });

this.$c().onMessage(HIDE_MESSAGE)
  .forChannel(APP_CHANNEL)
  .invoke(() => {
    this.hideMessage();
  });
```

**`invoke` and `this`**

`invoke(...)` calls your handler with the component instance as `this`. Passing a method reference (e.g. `this.removeTodo`) is fine because Cydran binds `this` to the component when invoking. Arrow functions still work, but they ignore rebinding and capture `this` lexically instead.

### Message-Driven Patterns

Messages enable:
- Parent-child communication
- Sibling component communication
- Global event broadcasting
- Decoupled architecture

---

## Dependency Injection

### Registering Components

In the root capability function, register components with the IoC container:

```javascript
function rootCapability(context) {
  // Register a singleton (one instance for the app)
  context.registerSingleton('app', HelloWorld);
}
```

**Singleton vs Prototype**

- **Singleton**: One shared instance for the entire app. Use for services, repositories, and root-level components that should be unique (e.g., `TodoRepo`, the root `App` component).
- **Prototype**: A new instance is created each time the container is asked for one. Use for components that appear multiple times (e.g., list items like `TodoItem`, dialog instances, or routed views).

Register a prototype that receives a transmitter:

```javascript
context.registerPrototype(TodoItem.name, TodoItem,
  ab().withTransmitter().build()
);
```

### ArgumentsBuilder

Use `argumentsBuilder` (aliased as `ab`) to configure component dependencies:

```javascript
const ab = cydran.argumentsBuilder;

// Inject logger and transmitter
ab()
  .withLogger('MyComponent')
  .withTransmitter()
  .build()
```

### Injected Dependencies

Components defined with dependencies receive them in the constructor.

### Accessing Singletons

Get registered singletons:

```javascript
onMount() {
  this.app = this.$c().getObject('app');
}
```

---

## Lifecycle Hooks

### Component Lifecycle

#### `constructor()`
- Called when the component class is instantiated
- Initialize properties, set up watchers, subscribe to messages

```javascript
constructor() {
  super(template('hello-world'));
  this.greeting = 'Hello World!';
}
```

#### `onMount()`
- Called after the component is mounted to the DOM
- Perfect for loading data, getting service references

```javascript
onMount() {
  // Acquire services or data after mount
}
```

### Hook Order

1. Component instantiation (`constructor`)
2. Template compilation and DOM insertion
3. `onMount()` called
4. Component ready for interaction

### Additional Lifecycle Hooks

- `onUnmount()`: Called when the component is removed from the DOM.
- `onRemount()`: Called when the component is re-inserted after being unmounted.
- `$release()`: Disposal hook invoked by the framework when a component is torn down.

### Lifecycle State Machine

<svg viewBox="0 0 760 200" width="100%" height="200" role="img" aria-label="Component lifecycle state machine">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#2d6a4f"></path>
    </marker>
  </defs>
  <circle cx="20" cy="43" r="6" fill="#2d6a4f"></circle>
  <text x="36" y="48" text-anchor="start" font-size="12" fill="#6b5f52">start</text>

  <rect x="70" y="20" width="140" height="46" rx="8" fill="#ffffff" stroke="#e7ded3"></rect>
  <text x="140" y="48" text-anchor="middle" font-size="14" fill="#1e1b16">Constructed</text>

  <rect x="240" y="20" width="140" height="46" rx="8" fill="#ffffff" stroke="#e7ded3"></rect>
  <text x="310" y="48" text-anchor="middle" font-size="14" fill="#1e1b16">Mounted</text>

  <rect x="410" y="20" width="140" height="46" rx="8" fill="#ffffff" stroke="#e7ded3"></rect>
  <text x="480" y="48" text-anchor="middle" font-size="14" fill="#1e1b16">Unmounted</text>

  <rect x="580" y="20" width="140" height="46" rx="8" fill="#ffffff" stroke="#e7ded3"></rect>
  <text x="650" y="48" text-anchor="middle" font-size="14" fill="#1e1b16">Disposed</text>

  <line x1="24" y1="43" x2="70" y2="43" stroke="#2d6a4f" stroke-width="2" marker-end="url(#arrow)"></line>

  <line x1="210" y1="43" x2="240" y2="43" stroke="#2d6a4f" stroke-width="2" marker-end="url(#arrow)"></line>
  <text x="225" y="30" text-anchor="middle" font-size="12" fill="#6b5f52">onMount()</text>

  <line x1="380" y1="43" x2="410" y2="43" stroke="#2d6a4f" stroke-width="2" marker-end="url(#arrow)"></line>
  <text x="395" y="30" text-anchor="middle" font-size="12" fill="#6b5f52">onUnmount()</text>

  <path d="M480,70 C480,120 310,120 310,70" fill="none" stroke="#2d6a4f" stroke-width="2" marker-end="url(#arrow)"></path>
  <text x="395" y="122" text-anchor="middle" font-size="12" fill="#6b5f52">onRemount()</text>

  <line x1="310" y1="10" x2="580" y2="10" stroke="#2d6a4f" stroke-width="2" marker-end="url(#arrow)"></line>
  <text x="445" y="6" text-anchor="middle" font-size="12" fill="#6b5f52">$release()</text>
</svg>

---

## Advanced Features

### Logging

Enable and configure logging:

```javascript
const PROPERTIES = {
  [cydran.PropertyKeys.CYDRAN_LOG_LEVEL]: 'info'
};
```

You can also add custom properties and strict-mode settings:

```javascript
const PROPERTIES = {
  ['todo.person']: '',
  [PropertyKeys.CYDRAN_STRICT_ENABLED]: true,
  [PropertyKeys.CYDRAN_STRICT_STARTPHRASE]: 'Your motivational message',
  [PropertyKeys.CYDRAN_LOG_LEVEL]: 'trace',
  [PropertyKeys.CYDRAN_LOG_LABEL]: 'ctdmvc'
};
```

### Scope Functions

Register reusable functions accessible from templates via `s()`:

```javascript
function rootCapability(context) {
  context.getScope().add('exclaim', (str) => `${str}!`);
}
```

Usage in template:
```html
{{s().exclaim(m().greeting)}}
```

### Filters

Create computed filtered collections with predicates:

```javascript
this.filtered = this.$c()
  .createFilter('m().messages')
  .withPredicate("v().startsWith('Hello')", 'm().clickCount')
  .build();
```

Then use in template:
```html
<ul c-each="m().filtered.items()">
  <li>{{v()}}</li>
</ul>
```

### Stage Initialization

Customize what component loads initially:

```javascript
const stage = cydran.create('#app', PROPERTIES, rootCapability);
stage.addInitializer(null, s => {
  s.setComponentByObjectId('app');  // Load app component by default
});
stage.start();
```

---

## State Machine

Cydran exposes `stateMachineBuilder` for lightweight state machines you can use in your components or services.

### Basic Example

```javascript
const { stateMachineBuilder } = cydran;

const machine = stateMachineBuilder('IDLE')
  .withState('IDLE', [model => { model.status = 'idle'; }])
  .withState('RUNNING', [model => { model.status = 'running'; }])
  .withTransition('IDLE', 'start', 'RUNNING', [
    model => { model.startedAt = Date.now(); }
  ])
  .withTransition('RUNNING', 'stop', 'IDLE', [
    model => { model.stoppedAt = Date.now(); }
  ])
  .build();

const model = { status: 'idle' };
const instance = machine.create(model);

// Trigger transitions
machine.submit('start', instance);
machine.submit('stop', instance);
```

### Guarded Transition Example

```javascript
const machine = stateMachineBuilder('CLOSED')
  .withState('CLOSED', [])
  .withState('OPEN', [])
  .withTransition('CLOSED', 'open', 'OPEN', [
    model => { model.isOpen = true; }
  ], (model) => model.canOpen === true)
  .build();
```

### Notes

- `withState(stateName, [handlers])` registers entry handlers for that state.
- `withTransition(fromState, input, toState, [handlers], [guard])` adds a transition.
- `build()` validates the machine and returns a reusable definition.

## Library Exports (Constants and Enums)

The Cydran build exposes the following constants/enums for application use:

### `PropertyKeys`

Configuration keys for the properties map passed to `cydran.create(...)`.

```
CYDRAN_CLONE_MAX_EVALUATIONS
CYDRAN_DIGEST_MAX_EVALUATIONS
CYDRAN_EQUALS_MAX_EVALUATIONS
CYDRAN_LAZY_STARTPHRASE
CYDRAN_LOG_COLOR_PREFIX
CYDRAN_LOG_LABEL
CYDRAN_LOG_LABEL_VISIBLE
CYDRAN_LOG_LEVEL
CYDRAN_LOG_APPENDERS
CYDRAN_LOG_ALLOW_SUPRESS_DEFAULT_APPENDER
CYDRAN_LOG_PREAMBLE_ORDER
CYDRAN_LOG_STRATEGY
CYDRAN_OVERRIDE_WINDOW
CYDRAN_STARTUP_SYNCHRONOUS
CYDRAN_STRICT_ENABLED
CYDRAN_STRICT_MESSAGE
CYDRAN_STRICT_STARTPHRASE
CYDRAN_STYLES_ENABLED
```

### `To`

Message propagation targets for transmitters.

```
GLOBALLY
CONTEXT
DESCENDANTS
IMMEDIATE_CHILDREN
IMMEDIATE_CHILD_COMPONENTS
PARENT
PARENTS
ROOT
```

### `Events`

Component lifecycle/mutation events on the internal channel.

```
AFTER_CHILD_ADDED
AFTER_CHILD_CHANGED
AFTER_CHILD_REMOVED
AFTER_PARENT_ADDED
AFTER_PARENT_CHANGED
AFTER_PARENT_REMOVED
BEFORE_CHILD_ADDED
BEFORE_CHILD_CHANGED
BEFORE_CHILD_REMOVED
BEFORE_PARENT_ADDED
BEFORE_PARENT_CHANGED
BEFORE_PARENT_REMOVED
COMPONENT_NESTING_CHANGED
CYDRAN_PREAPP_DISPOSAL
```

### `BehaviorFlags`

Flags used by behaviors.

```
PROPAGATION
EXPRESSION_DISALLOWED
```

### `JSType`

String values representing JavaScript types.

```
STR
BOOL
BIGINT
NUM
SYM
FN
OBJ
UND
```

### `ArgumentType`

Argument descriptors used with the IoC container.

```
OBJECT
PROVIDER
TRANSMITTER
RECEIVER
MESSAGE_SUBSCRIBER
INSTANCE_ID
INSTANCE_ID_PROVIDER
CONTEXT
ARGUMENT
LOGGER
FUNCTION
CONSTANT
PROPERTY
PROPERTY_PROVIDER
PROPERTY_SUBSCRIBER
PROPERTY_FALLBACK_SUBSCRIBER
SCOPE_ITEM
```

---

## Library Exports (Core API)

The Cydran build also exposes core classes and helpers:

- `Component`, `ElementComponent`
- `AbstractBehavior`, `AbstractValueBehavior`
- `argumentsBuilder`
- `create`, `noConflict`
- `getLogger`
- `stateMachineBuilder`
- `uuidV4`
- `setStrictTypeChecksEnabled`
- Utility helpers: `isDefined`, `requireNotNull`, `requireValid`, `merge`, `overlay`, `padLeft`, `padRight`, `enumKeys`

These are stable entry points for building and composing components and infrastructure.

## Best Practices

### 1. **Separation of Concerns**

- **Components**: UI logic and state management
- **Services/Repositories**: Data access and business logic
- **Models**: Plain data objects

```javascript
// Component - UI and coordination
class HelloWorld extends cydran.Component {
  constructor() {
    super(template('hello-world'));
    // Setup UI and coordination
  }
}
```

### 2. **Use Message-Based Communication**

Don't pass data directly between components. Use messages instead:

```javascript
// Good: Decoupled through messaging
this.txmitr.send(To.GLOBALLY, APP_CHANNEL, CLICKED, this.clickCount);

this.$c().onMessage(CLICKED)
  .forChannel(APP_CHANNEL)
  .invoke(count => this.clickCount = count);

// Avoid: Tight coupling
otherComponent.updateGreeting();
```

### 3. **Leverage Dependency Injection**

Register services as singletons, components as prototypes:

```javascript
// Singleton - shared across app
context.registerSingleton('app', HelloWorld);
```

### 4. **Watch Expressions Sparingly**

Only watch expressions you need to react to:

```javascript
// Watch the specific property that changes
this.$c().onExpressionValueChange('m().clickCount', () => {
  // React only to click count changes
});

// Don't watch everything
// this.$c().onExpressionValueChange('m()', () => { /* ... */ });
```

### 5. **Use Filters for Computed Collections**

Don't manually filter arrays. Use Cydran filters:

```javascript
// Good: Reactive and efficient
this.filtered = this.$c()
  .createFilter('m().messages')
  .withPredicate("v().includes('clicked')", 'm().clickCount')
  .build();
```

### 6. **Initialize in onMount()**

Defer initialization that requires DOM or services:

```javascript
constructor() {
  super(template('hello-world'));
  // Setup UI model only
  this.greeting = 'Hello World!';
}

onMount() {
  // Get services and load data
}
```

### 7. **Keep Templates Clean**

Use component methods instead of complex logic in templates:

```javascript
// Good: Logic in component
class HelloWorld extends cydran.Component {
  getGreetingText() {
    return `${this.greeting} (${this.clickCount})`;
  }
}

// Template
<span>{{m().getGreetingText()}}</span>

// Avoid: Complex expressions
<span>{{m().greeting}} ({{m().clickCount}})</span>
```

### 8. **Use Strict Mode**

Enable strict mode during development for better validation:

```javascript
const PROPERTIES = {
  [cydran.PropertyKeys.CYDRAN_STRICT_ENABLED]: true,
  [cydran.PropertyKeys.CYDRAN_STRICT_STARTPHRASE]: 'Your motivational message'
};
```

---

## Project Example: Hello World

This project demonstrates a single `HelloWorld` component wired to `#app` in `index.html`.

### Project Structure
```
app.js        # Component + stage setup
index.html    # HTML with templates
cydran.js     # Framework build (local)
```

### Run the Example

Open `index.html` in a browser to see the component render and respond to clicks.

---

## Project Example: TodoApp (from todoapp.js)

The TodoApp demonstrates filtered collections, injected dependencies, and message-driven updates.

### Filtered Collection with Parameters

```javascript
this.filtered = this.$c().createFilter('m().todos')
  .withPredicate(
    "p(0) === 'all' || !v().completed && p(0) === 'active' || v().completed && p(0) === 'completed'",
    'm().filterVisiblity'
  )
  .build();
```

### Repository Injection

```javascript
context.registerSingleton(TodoRepo.name, TodoRepo,
  ab().withLogger(`${App.name}.Repo`).withTransmitter().build()
);
```

### Messaging from Items

```javascript
this.txmitr.send(To.GLOBALLY, TODO_CHANNEL, RMV_TODO, this.$c().getValue());
```

### Stage Selector

```javascript
const stage = create('body>div#appbody', PROPERTIES, rootCapability);
stage.addInitializer(null, s => {
  s.setComponentByObjectId('App');
});
```

## Summary

Cydran provides a lightweight, declarative framework for building interactive web applications with:

- **Components** for UI organization
- **Templates** with powerful binding syntax
- **Messaging** for decoupled communication
- **Dependency Injection** for testability and flexibility
- **MVVM Architecture** for clean code organization

By following Cydran's patterns and best practices, you can build maintainable, scalable web applications.

---

## New Project Checklist

Use this list to bootstrap a new project quickly:

1. **Create HTML shell**
   - Add a root element (e.g., `<div id="app"></div>`).
   - Add `<template>` tags for each component.
   - Include `cydran.js` and your app script(s).

2. **Define a template loader**
   - Implement a `template(id)` helper that returns HTML strings.
   - Map component names to template ids.

3. **Create the root component**
   - Extend `cydran.Component`.
   - Initialize state in `constructor()`.
   - Use `onMount()` for DOM- or data-dependent work.

4. **Register components and services**
   - `registerSingleton` for shared services or the root component.
   - `registerPrototype` for repeated components.

5. **Start the stage**
   - `const stage = cydran.create('#app', PROPERTIES, rootCapability);`
   - `stage.addInitializer(null, s => s.setComponentByObjectId('app'));`
   - `stage.start();`

6. **Add communication and placement**
   - Use `$c().onMessage(...)` for messaging.
   - Use `c-region` + `regions().set(...)` for child placement.
   - Use `c-series` + `forSeries(...)` for lists of components.

7. **Enable helpful settings (optional)**
   - Strict mode and logging via `PropertyKeys`.

This checklist plus the API reference should be enough to start a new Cydran project without retraining.

---

## Resources

- **GitHub**: https://github.com/cydran/cydran
- **Framework**: An unobtrusive JavaScript presentation framework for the modern web

---

## End-to-End Hello World Example

Below is a complete minimal example. The root component renders in the body and shows a button to reveal a child component. The child says “Hello World” and includes a Hide button that tells the parent to hide it.

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cydran Hello World</title>
</head>
<body>
  <div id="app">cydran failed</div>

  <template id="app-root">
    <div>
      <p>{{m().message}}</p>
      <button c-onclick="m().showChild()" c-enabled="!m().childVisible">Show Hello</button>
      <c-region name="helloRegion"></c-region>
    </div>
  </template>

  <template id="hello-child">
    <div>
      <strong>Hello World</strong>
      <button c-onclick="m().hideMe()">Hide</button>
    </div>
  </template>

  <script src="./cydran.js"></script>
  <script src="./app.js"></script>
</body>
</html>
```

**app.js**
```javascript
const template = (id) => {
  const el = document.querySelector(`template[id="${id}"]`);
  return el ? el.innerHTML.trim() : '';
};

const APP_CHANNEL = 'APP';
const HIDE_CHILD = 'hideChild';

class AppRoot extends cydran.Component {
  constructor() {
    super(template('app-root'));
    this.message = 'Click to reveal the child component.';
    this.childVisible = false;

    this.$c().onMessage(HIDE_CHILD)
      .forChannel(APP_CHANNEL)
      .invoke(() => this.hideChild());
  }

  showChild() {
    if (this.childVisible) {
      return;
    }
    this.$c().regions().setByObjectId('helloRegion', 'helloChild');
    this.childVisible = true;
  }

  hideChild() {
    this.$c().regions().set('helloRegion', null);
    this.childVisible = false;
  }
}

class HelloChild extends cydran.Component {
  constructor() {
    super(template('hello-child'));
  }

  hideMe() {
    this.$c()
      .send(HIDE_CHILD)
      .onChannel(APP_CHANNEL)
      .withPropagation(cydran.To.PARENT);
  }
}

function rootCapability(context) {
  context.registerSingleton('app', AppRoot);
  context.registerPrototype('helloChild', HelloChild);
}

const stage = cydran.create('#app', {}, rootCapability);
stage.addInitializer(null, s => {
  s.setComponentByObjectId('app');
});
stage.start();
```
