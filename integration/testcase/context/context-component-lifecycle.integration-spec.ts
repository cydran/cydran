

/**
 * Component instantiated manually and messages are broadcasted
 */
test("Placeholder", () => {
	// Verify nothing happens
	expect(true).toBeTruthy();
});

/**
 * Component instantiated manually, placed on a stage, and messages are broadcasted
 */
test("Placeholder", () => {
	// Verify messages are broadcasted starting at the root context 
	expect(true).toBeTruthy();
});

/**
 * Component instantiated manually, has a context set, and messages are broadcasted
 */
test("Placeholder", () => {
	// Verify messages are broadcasted starting at the set context 
	expect(true).toBeTruthy();
});

/**
 * Component instantiated manually, has a context set, placed on a stage, and messages are broadcasted, removed from stage, and messages are broadcasted
 */
test("Placeholder", () => {
	// Verify messages are broadcasted starting at the set context
	expect(true).toBeTruthy();
});

/**
 * Component instantiated from registry and messages are broadcasted
 */
test("Placeholder", () => {
	// Verify messages are broadcasted starting at the injected context
	expect(true).toBeTruthy();
});

/**
 * Component instantiated from registry, placed on a stage, and messages are broadcasted
 */
test("Placeholder", () => {
	// Verify messages are broadcasted starting at the injected context
	expect(true).toBeTruthy();
});

/**
 * Component instantiated from registry
 * has a context set
 * messages are broadcast
 * placed on a stage
 * messages are broadcasted
 * removed from a stage
 * and messages are broadcasted
 */
test("Placeholder", () => {
	// Verify messages are broadcasted starting at the set context during all broadcast operations, messages are broadcasted starting at the injected context
	expect(true).toBeTruthy();
});

// TODO - Support object retrieval from context in tests

/**
 * Component manually instantiated and object is retrieved from context
 */
test("Placeholder", () => {
	// Verify object came from global
	expect(true).toBeTruthy();
});

/**
 * Component manually instantiated, context is set, and object is retrieved from context
 */
test("Placeholder", () => {
	// Verify object came from set context
	expect(true).toBeTruthy();
});

/**
 * Component manually instantiated, context is set, and component is placed on the stage, object is retrieved from context
 */
test("Placeholder", () => {
	// Verify object came from set context
	expect(true).toBeTruthy();
});

/**
 * Component instantiated from registry, context is injected, and object is retrieved from context
 */
test("Placeholder", () => {
	// Verify object came from injected context
	expect(true).toBeTruthy();
});

/**
 * Component instantiated from registry, context is injected, and component is placed on the stage, and object is retrieved from context
 */
test("Placeholder", () => {
	// Verify object came from injected context
	expect(true).toBeTruthy();
});
