"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
class TaskExecutor {
    constructor(defaultTask) {
        this.defaultTask = (0, Utils_1.requireNotNull)(defaultTask, "defaultTask");
        this.tasks = {};
    }
    register(name, type) {
        this.tasks[name] = type;
    }
    execute(name, config) {
        const taskClass = (0, Utils_1.isDefined)(this.tasks[name]) ? this.tasks[name] : this.defaultTask;
        const task = new taskClass(config);
        task.setConfig(config);
        task.run();
    }
}
exports.default = TaskExecutor;
