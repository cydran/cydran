import TransmitterImpl from "message/TransmitterImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";

class TransmitterArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return new TransmitterImpl(context);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default TransmitterArgumentResolver;
