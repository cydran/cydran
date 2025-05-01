import Task from "./Task.js";
import { requireNotNull } from "../Utils.js";
import Config from "../Config.js";
import Output from "../Output.js";
import OutputImpl from "../OutputImpl.js";
import fs from "fs";

abstract class AbstractTask<T> implements Task, Output {

	private name: string;

	private config: Config;

	private output: Output;

	constructor(name) {
		this.name = requireNotNull(name, "name");
		this.output = new OutputImpl();
	}

	public separator(): void {
		this.output.separator();
	}

	public blankLine(): void {
		this.output.blankLine();
	}

	public print(text: string): void {
		this.output.print(text);
	}

	public getConfig(): Config {
		return this.config;
	}

	public setConfig(config: Config): void {
		this.config = requireNotNull(config, "config");
	}

	public async run(): Promise<void> {
		this.separator();
		this.print(this.name + " task - Started");
		this.separator();
		this.blankLine() 
		this.initialize();
		await this.execute();
		this.blankLine() 
		this.separator();
		this.print(this.name + " task - Complete");
		this.separator();
	}

	public async execute(): Promise<void> {
		// Intentionally do nothing by default
	}

	protected getTaskConfig(): T {
		return this.config.getTask(this.name);
	}

	private initialize(): void {
		fs.mkdirSync(this.getConfig().getCommon().getWorkPath(), {recursive: true});
		fs.mkdirSync(this.getConfig().getCommon().getDistPath(), {recursive: true});

		// TODO - Implement
	}

}

export default AbstractTask;
