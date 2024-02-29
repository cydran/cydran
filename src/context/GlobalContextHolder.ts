import { requireNotNull } from 'util/Utils';
import GlobalContext from 'context/GlobalContext';

class GlobalContextHolder {

	private static instance: GlobalContext;

	private constructor() {
		GlobalContextHolder.instance = null;
	}

	public static getContext(): GlobalContext {
		return GlobalContextHolder.instance;
	}

	public static setContext(context: GlobalContext): void {
		GlobalContextHolder.instance = requireNotNull(context, "context");
	}

}

export default GlobalContextHolder;
