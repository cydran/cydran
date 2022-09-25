import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import DomWalker from "component/DomWalker";
import Dom from "dom/Dom";
import Factories from 'factory/Factories';
import LoggerFactory from "log/LoggerFactory";
import IdGenerator from "util/IdGenerator";

interface Services {

	getDom(): Dom;

	getFactories(): Factories;

	logFactory(): LoggerFactory;

	idGenerator(): IdGenerator;

	getBehaviorsRegistry(): BehaviorsRegistry;

	getDomWalker(): DomWalker<any>;

}

export default Services;
