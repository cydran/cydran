import { requireNotNull } from './Utils.js';
import Options from './Options.js';

const DEFAULT_TASK_NAME: string = "help";

const FIRST_ARGUMENT_INDEX: number = 2;

class ArgumentsParser {

	private arguments: string[];

	private taskName: string;

	private options: Options;

	constructor(args: string[]) {
		this.arguments = requireNotNull(args, "args");

		const taskArguments: string[] = this.arguments.slice(FIRST_ARGUMENT_INDEX);
		const hasTaskName: boolean = taskArguments.length > 0 && taskArguments[0].indexOf("--") !== 0;

		this.taskName = hasTaskName ? taskArguments[0] : DEFAULT_TASK_NAME;
		this.options = new Options(hasTaskName ? taskArguments.slice(1) : taskArguments);
	}

	public getTaskName(): string {
		return this.taskName;
	}

	public getOptions(): Options {
		return this.options;
	}

	public getArguments(): string[] {
		return this.arguments;
	}

}

export default ArgumentsParser;
