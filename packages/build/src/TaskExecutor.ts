import Config from "./Config.js";
import SimpleMap from "./SimpleMap.js";
import Task from "./task/Task.js";
import Type from "./Type.js";
import { isDefined, requireNotNull } from './Utils.js';

class TaskExecutor {

	private tasks: SimpleMap<Type<Task>>;

	private defaultTask: Type<Task>;

	constructor(defaultTask: Type<Task>) {
		this.defaultTask = requireNotNull(defaultTask, "defaultTask");
		this.tasks = {};
	}

	public register(name: string, type: Type<Task>): void {
		this.tasks[name] = type;
	}

	public async execute(name: string, config: Config): Promise<void> {
		const taskClass = isDefined(this.tasks[name]) ? this.tasks[name] : this.defaultTask;
		const task = new taskClass(config);
		task.setConfig(config);
		await task.run();
	}

}

export default TaskExecutor;
