import Task from "./Task";
import { requireNotNull } from "../Utils";
import Config from "../Config";
import Output from "../Output";
import OutputImpl from '../OutputImpl';
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

	public run() {
		this.separator();
		this.print(this.name + " task - Started");
		this.separator();
		this.blankLine() 
		this.initialize();
		this.execute();
		this.blankLine() 
		this.separator();
		this.print(this.name + " task - Complete");
		this.separator();
	}

	public execute() {
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
