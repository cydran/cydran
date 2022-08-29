import Dom from 'dom/Dom';

interface InternalDom extends Dom {

	onReady(callback?: any, targetThis?: any);

}

export default InternalDom;