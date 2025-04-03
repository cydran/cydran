import AbstractTask from "./AbstractTask";

import fs from 'fs/promises';
import { existsSync } from 'fs';

async function removeDir(directory) {
	if (!existsSync(directory)) {
		return;
	}

	try {
		await fs.rm(directory, { recursive: true, force: true });
	} catch (err) {
		if (err.code === 'ENOTEMPTY' || err.code === 'EPERM' || err.code === 'EBUSY') {
			await deleteFilesRecursively(directory);
		} else {
			throw err;
		}
	}
}

async function deleteFilesRecursively(directory) {
	try {
		const files = await fs.readdir(directory);
		await Promise.all(files.map(async (file) => {
			const filePath = `${directory}/${file}`;
			const stat = await fs.lstat(filePath);

			if (stat.isDirectory()) {
				await deleteFilesRecursively(filePath);
				console.log(`Deleting directory: ${filePath}`);
				await fs.rmdir(filePath);
			} else {
				console.log(`Deleting file: ${filePath}`);
				await fs.unlink(filePath);
			}
		}));
		await fs.rmdir(directory);
	} catch (err) {
		console.error(`Failed to delete ${directory}:`, err);
	}
}

class CleanTask extends AbstractTask<any> {

	constructor() {
		super("Clean");
	}

	public async execute() {
		await this.remove(this.getConfig().getCommon().getDistPath());
		await this.remove(this.getConfig().getCommon().getWorkPath());
	}

	private async remove(path: string): Promise<void> {
		this.print("Removed: " + path);
		await removeDir(path);
	}

}

export default CleanTask;
