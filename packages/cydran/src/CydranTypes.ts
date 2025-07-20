type CallBackThisObject = object;
type PropertyChangeCallback<T> = (value: T) => void;
type PropertyChangeFallbackCallback<T> = (key: string, value: T) => void;

type PropertySubscriber<T> = (thisObject: CallBackThisObject, callback: PropertyChangeCallback<T>) => void;
type PropertyFallBackSubscriber<T> = (thisObject: CallBackThisObject, callback: PropertyChangeFallbackCallback<T>) => void;

type PropertyProvider<T> = () => T;

export { PropertyProvider, PropertySubscriber, PropertyFallBackSubscriber,
	PropertyChangeCallback, PropertyChangeFallbackCallback, CallBackThisObject
};
