# cydran
Unobtrusive Javascript presentation framework

### Important Lifecydle Events
+ Events.AFTER_PARENT_ADDED
  * Recipient: Component upon which the event occured
  * When: Before state change occurance
  * Significance: New parent is set in component when prior parent was null
+ Events.AFTER_PARENT_CHANGED
  * Recipient: Component upon which the event occured
  * When: Before state change occurance
  * Significance: New parent set regardless of prior or new parent being null
+ Events.AFTER_PARENT_REMOVED
  * Recipient: Component upon which the event occured
  * When: Before state change occurance
  * Significance: Parent is set null when prior parent was non-null
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