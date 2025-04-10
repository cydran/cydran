#!/usr/bin/env node

import path from "path";
import StartTask from "./task/StartTask";
import HelpTask from "./task/HelpTask";
import EjectTask from "./task/EjectTask";
import CleanTask from "./task/CleanTask";
import TestTask from "./task/TestTask";
import BuildTask from "./task/BuildTask";
import TaskExecutor from './TaskExecutor';
import ArgumentsParser from "./ArgumentsParser";
import Config from "./Config";
import ConfigFactory from './config/ConfigFactory';

const appRootPath: string = path.resolve(__dirname, "..");

const executor: TaskExecutor = new TaskExecutor(HelpTask);
executor.register("start", StartTask);
executor.register("build", BuildTask);
executor.register("clean", CleanTask);
executor.register("test", TestTask);
executor.register("eject", EjectTask);
executor.register("help", HelpTask);

const parser: ArgumentsParser = new ArgumentsParser(process.argv);
const configFactory: ConfigFactory = new ConfigFactory(appRootPath);
const config: Config = configFactory.create();

const taskName = parser.getTaskName();

(async () => {
	await executor.execute(taskName, config);
})();
