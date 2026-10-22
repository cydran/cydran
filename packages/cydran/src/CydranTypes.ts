type CallBackThisObject = object;
type PropertyChangeCallback<T> = (value: T) => void;
type PropertyChangeFallbackCallback<T> = (key: string, value: T) => void;

type PropertySubscriber = (thisObject: CallBackThisObject, name: string) => void;
type PropertyFallBackSubscriber = (thisObject: CallBackThisObject, name: string) => void;

type PropertyProvider<T> = () => T;

export { PropertyProvider, PropertySubscriber, PropertyFallBackSubscriber,
	PropertyChangeCallback, PropertyChangeFallbackCallback, CallBackThisObject
};
