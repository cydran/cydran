import ArgumentsHolder from "stage/ArgumentsHolder";
import { requireNotNull } from "util/Utils";
import Disposable from "interface/ables/Disposable";

class ArgumentsHolderImpl implements ArgumentsHolder, Disposable {
	private holder: any[];

	constructor() {
		this.holder = new Array();
	}

	add<T>(value: T): void {
		this.holder.push(value);
	}

	get<T>(id: string): T {
		requireNotNull(id, "id");
		return this.holder[id];
	}

	getAll(): any[] {
		return this.holder;
	}

	$dispose(): void {
		this.holder = null;
	}

}

export default ArgumentsHolderImpl;
