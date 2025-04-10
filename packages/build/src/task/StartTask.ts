import AbstractTask from "./AbstractTask";
import fs from "fs";
import fse from "fs-extra";
import express from "express";

interface StartConfig {

	port: number;

}

class StartTask extends AbstractTask<StartConfig> {

	constructor() {
		super("Start");
	}

	public async execute(): Promise<void> {
		this.copy();
		this.serve();
	}

	copy() {
		fs.mkdirSync(this.getConfig().getCommon().getDistPath(), {recursive: true});
		fse.copySync(this.getConfig().getCommon().getStaticPath(), this.getConfig().getCommon().getDistPath(), { overwrite: true, recursive: true }, (err) => {
			if (err) {
				console.log(err + " - Error copying static files to " + this.getConfig().getCommon().getDistPath());
			}
		});
	}

	serve() {
		const port: number = this.getTaskConfig().port;
		const app = express();
		app.use("/", express.static(this.getConfig().getCommon().getDistPath(), {index: "index.html"}));
		app.listen(port, () => console.log(`Running on port ${port}`));
	}

}

export default StartTask;
