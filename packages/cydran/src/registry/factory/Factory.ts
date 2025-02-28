import Releasable from "interface/ables/Releasable";
import { Context } from 'context/Context';

interface Factory<T, C> extends Releasable {

	get(localContext: Context, originContext: Context, instanceArguments: any[]): T;

}

export default Factory;
