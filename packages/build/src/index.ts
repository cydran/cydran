#!/usr/bin/env node

import path from "path";
import StartTask from "./task/StartTask.js";
import HelpTask from "./task/HelpTask.js";
import EjectTask from "./task/EjectTask.js";
import CleanTask from "./task/CleanTask.js";
import TestTask from "./task/TestTask.js";
import BuildTask from "./task/BuildTask.js";
import ValidateTask from "./task/ValidateTask.js";
import TaskExecutor from './TaskExecutor.js';
import ArgumentsParser from "./ArgumentsParser.js";
import Config from "./Config.js";
import ConfigFactory from './config/ConfigFactory.js';
import { fileURLToPath } from 'node:url';

const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);
const appRootPath: string = path.resolve(dirname, "..");

const executor: TaskExecutor = new TaskExecutor(HelpTask);
executor.register("validate", ValidateTask);
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
