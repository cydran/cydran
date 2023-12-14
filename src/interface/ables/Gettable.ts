interface Gettable {

	getObject<T>(id: string, ...instanceArguments: any[]): T;

	getLocalObject<T>(id: string, ...instanceArguments: any[]): T;

}

export default Gettable;
