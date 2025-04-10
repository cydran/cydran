import BlogServiceImpl from './BlogServiceImpl';
import { argumentsBuilder, Context } from "@cydran/cydran";

function serviceCapability(context: Context) {
	context.registerSingleton("blogService", BlogServiceImpl, argumentsBuilder().withLogger("BlogServiceImpl").withTransmitter().build());
}

export default serviceCapability;
