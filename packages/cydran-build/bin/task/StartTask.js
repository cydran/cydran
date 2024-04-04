"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractTask_1 = __importDefault(require("./AbstractTask"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const express_1 = __importDefault(require("express"));
class StartTask extends AbstractTask_1.default {
    constructor() {
        super("Start");
    }
    execute() {
        this.copy();
        this.serve();
    }
    copy() {
        fs_1.default.mkdirSync(this.getConfig().getCommon().getDistPath(), { recursive: true });
        fs_extra_1.default.copySync(this.getConfig().getCommon().getStaticPath(), this.getConfig().getCommon().getDistPath(), { overwrite: true, recursive: true }, (err) => {
            if (err) {
                console.log(err + " - Error copying static files to " + this.getConfig().getCommon().getDistPath());
            }
        });
    }
    serve() {
        const port = this.getTaskConfig().port;
        const app = (0, express_1.default)();
        app.use("/", express_1.default.static(this.getConfig().getCommon().getDistPath(), { index: "index.html" }));
        app.listen(port, () => console.log(`Running on port ${port}`));
    }
}
exports.default = StartTask;
