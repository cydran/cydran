import { Context, Stage } from 'context/Context';
interface GlobalContext extends Context {

	addRootChild(child: Context): void;

	removeRootChild(child: Context): void;

	tell(name: string, payload?: any): void;

	getParent(): Context;

	createChild(): Context;

	getStage(): Stage;

	removeChild(name: string): Context;

	getChild(name: string): Context;

	hasChild(name: string): boolean;

	addChild(name: string, initializer?: (context: Context) => void): Context;

}

export default GlobalContext;
