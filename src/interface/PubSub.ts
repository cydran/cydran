import { Disposable } from "./Ables";

interface Broker extends Disposable {
	broadcast(channelName: string, messageName: string, payload?: any): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;
}

interface OnContinuation {
	invoke(target: (payload: any) => void): void;

	forChannel(name: string): ForChannelContinuation;
}

interface ForChannelContinuation {
	invoke(target: (payload: any) => void): void;
}

interface Listener extends Disposable {
	register(messageName: string, fn: (payload: any) => void): void;

	receive(messageName: string, payload: any): void;

	getChannelName(): string;
}

interface PubSub extends Disposable {
	message(channelName: string, messageName: string, payload?: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	enableGlobal(): void;

	disableGlobal(): void;

	isGlobalEnabled(): boolean;
}

export { Broker, OnContinuation, ForChannelContinuation, Listener, PubSub };