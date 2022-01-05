import Dom from 'dom/Dom';
interface InternalDom extends Dom {

	onReady(callback?: any, context?: any);

}

export default InternalDom;