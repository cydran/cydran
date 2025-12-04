import Config from "../Config.js";

interface Task {

	run(): Promise<void>;

	setConfig(config: Config): void;

}

export default Task;
