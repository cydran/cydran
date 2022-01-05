import Dom from "dom/Dom";
import Factories from 'factory/Factories';

interface CydranContext {

	getDom(): Dom;

	getFactories(): Factories;

}

export default CydranContext;
