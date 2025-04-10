import Config from "../Config";

interface Task {

	run(): Promise<void>;

	setConfig(config: Config): void;

}

export default Task;
