import Dom from "dom/Dom";
import Factories from 'factory/Factories';
import LoggerFactory from "log/LoggerFactory";
import IdGenerator from "util/IdGenerator";

interface CydranContext {

	getDom(): Dom;

	getFactories(): Factories;

	logFactory(): LoggerFactory;

	idGenerator(): IdGenerator;
}

export default CydranContext;
