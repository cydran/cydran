import { Properties } from 'properties/Property';

type CallBackThisObject = Object;
type PropertyChangeCallback = (value: unknown) => void;
type PropertyChangeFallbackCallback = (key: string, value: unknown) => void;

type PropertySubscriber = (thisObject: CallBackThisObject, callback: PropertyChangeCallback) => void;
type PropertyFallBackSubscriber = (thisObject: CallBackThisObject, callback: PropertyChangeFallbackCallback) => void;

type PropertyProvider = () => unknown;

export { PropertyProvider, PropertySubscriber, PropertyFallBackSubscriber,
	PropertyChangeCallback, PropertyChangeFallbackCallback, CallBackThisObject
};
