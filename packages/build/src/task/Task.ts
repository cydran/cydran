import Config from "../Config";

interface Task {

	run(): void;

	setConfig(config: Config): void;

}

export default Task;
