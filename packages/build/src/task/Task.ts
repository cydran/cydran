import Config from "../Config.js";

interface Task {

	run(): Promise<void>;

	setConfig(config: Config): void;

	getName(): string;

	getSupportedOptions(): string[];

}

export default Task;
