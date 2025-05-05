import TransmitterImpl from "message/TransmitterImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import Transmitter from "message/Transmitter";

class TransmitterArgumentResolver implements ArgumentResolver<Transmitter> {

	public resolve(context: Context): Transmitter {
		return new TransmitterImpl(context);
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default TransmitterArgumentResolver;
