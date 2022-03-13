import Dom from "dom/Dom";
import Factories from 'factory/Factories';
import LoggerFactory from "log/LoggerFactory";

interface CydranContext {

	getDom(): Dom;

	getFactories(): Factories;

	logFactory(): LoggerFactory;

}

export default CydranContext;
