interface Gettable {

	getObject<T>(id: string): T;

	getLocalObject<T>(id: string): T;

}

export default Gettable;
