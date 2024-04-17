// TODO - Rename to StageStates

enum ContextStates {
	UNINITIALIZED = "UNINITIALIZED",
	BOOTSTRAPPED = "BOOTSTRAPPED",
	STARTING = "STARTED",
	READY = "READY",
	DISPOSING = "DISPOSING",
	DISPOSED = "DISPOSED"
}

export default ContextStates;
