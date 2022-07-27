import DestinationContinuation from 'continuation/DestinationContinuation';

interface SendContinuation extends DestinationContinuation {

	onChannel(channelName: string): DestinationContinuation;

}

export default SendContinuation;
