import Config from "./Config";
import SimpleMap from "./SimpleMap";
import Task from "./task/Task";
import Type from "./Type";
import { isDefined, requireNotNull } from './Utils';

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
