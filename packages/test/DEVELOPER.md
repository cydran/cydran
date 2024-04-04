## Cydran Developer Guide and Standards

An unobtrusive Javascript presentation framework

### Variable, Field, Argument, and Method naming

In order to maintain consistent semantics within the Cydran library codebase, field, argument and method naming standards have been established.

#### Fields / Arguments / Variables

##### targetThis

Object to be used as the *this* context when invoking a callback via apply() or call().

##### targetObject

Object being operated on being used outside of the context of being the *this* in a functional apply() or call().

##### callback

Function reference to use to call when an event occurs.

##### specimen

The object instance that is tested in a unit test.

##### name and id

A unique string identifier.

##### key

A string value that is valid for indexing into an object to identify a field.

##### fn

An acceptable abbreviation for function is fn, as the word function can in some contexts be too long. When a dismbiguation is needed, it can be combined with a qualifier indicating the purpose of the function such as *reducerFn*, *transformerFn*, etc.

#### Methods

##### Accessors and Mutators

Accessor methods should be named **getXXXXX()** where **XXXXX** is the Pascal case version of the name of the data point that it returns.  Mutator methods should be named **setXXXXXX()** where **XXXXX** is the Pascal case version of the name of the data point being set.