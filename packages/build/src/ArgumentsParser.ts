import { requireNotNull } from './Utils';

const DEFAULT_TASK_NAME: string = "help";

class ArgumentsParser {

	private arguments: string[];

	private taskName: string;

	constructor(args: string[]) {
		this.arguments = requireNotNull(args, "args");
		this.taskName = this.arguments.length == 3 ? this.arguments[2] : DEFAULT_TASK_NAME;
	}

	public getTaskName(): string {
		return this.taskName;
	}

	public getArguments(): string[] {
		return this.arguments;
	}

}

export default ArgumentsParser;
