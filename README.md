# cydran
Unobtrusive Javascript presentation framework

### Important Lifecydle Events
+ Events.BEFORE_PARENT_ADDED
  * Recipient: Component upon which the event occured
  * When: After state change occurance
  * Significance: New parent is set in component when prior parent was null
+ Events.BEFORE_PARENT_CHANGED
  * Recipient: Component upon which the event occured
  * When: After state change occurance
  * Significance: New parent set regardless of prior or new parent being null
+ Events.BEFORE_PARENT_REMOVED
  * Recipient: Component upon which the event occured
  * When: After state change occurance
  * Significance: Parent is set null when prior parent was non-null

+ Events.AFTER_PARENT_ADDED
  * Recipient: Component upon which the event occured
  * When: After state change occurance
  * Significance: New parent is set in component when prior parent was null
+ Events.AFTER_PARENT_CHANGED
  * Recipient: Component upon which the event occured
  * When: After state change occurance
  * Significance: New parent set regardless of prior or new parent being null
+ Events.AFTER_PARENT_REMOVED
  * Recipient: Component upon which the event occured
  * When: After state change occurance
  * Significance: Parent is set null when prior parent was non-null

+ Events.BEFORE_CHILD_ADDED
  * Recipient: Component whose child has changed
  * When: Before state change occurance
  * Significance: New child component is set where child within affected region was null
+ Events.BEFORE_CHILD_CHANGED
  * Recipient: Component whose child has changed
  * When: Before state change occurance
  * Significance: New child component is set regardless of prior region population
+ Events.BEFORE_CHILD_REMOVED
  * Recipient: Component whose child has changed
  * When: Before state change occurance
  * Significance: Child is set null when prior child was non-null

+ Events.AFTER_CHILD_ADDED
  * Recipient: Component whose child has changed
  * When: After state change occurance
  * Significance: New child component is set where child within affected region was null
+ Events.AFTER_CHILD_CHANGED
  * Recipient: Component whose child has changed
  * When: After state change occurance
  * Significance: New child component is set regardless of prior region population
+ Events.AFTER_CHILD_REMOVED
  * Recipient: Component whose child has changed
  * When: After state change occurance
  * Significance: Child is set null when prior child was non-null

+ Events.BEFORE_DISPOSE
  * Recipient: Component upon which the event occured
  * When: Before disposal of component
  * Significance: Last gasp of component (requisite clean-up)
