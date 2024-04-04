import BlogServiceImpl from './BlogServiceImpl';
import { argumentsBuilder, Context } from 'cydran';

function serviceCapability(context: Context) {
	context.registerSingleton("blogService", BlogServiceImpl, argumentsBuilder().withLogger("BlogServiceImpl").withPubSub().build());
}

export default serviceCapability;
