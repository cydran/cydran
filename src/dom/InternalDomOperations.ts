import DomOperations from 'dom/DomOperations';
interface InternalDomOperations extends DomOperations {

	domReady(callback?: any, context?: any);

}

export default InternalDomOperations;