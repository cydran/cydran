import { requireNotNull } from "../Utils.js";
import AbstractTask from "./AbstractTask.js";
import Task from "./Task.js";

abstract class AbstractCompoundTask extends AbstractTask<any> {

	private tasks: Task[] = [];

	constructor(name: string) {
		super(name);
		this.tasks = [];
	}

	public async execute(): Promise<void> {
		for (const task of this.tasks) {
			task.setConfig(this.getConfig());
		}

		for (const task of this.tasks) {
			await task.run();
		}
	}

	protected add(task: AbstractTask<any>): void {
		requireNotNull(task, "task");

		this.tasks.push(task);
	}

}

export default AbstractCompoundTask;