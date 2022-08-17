import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import Dom from "dom/Dom";
import Factories from 'factory/Factories';
import LoggerFactory from "log/LoggerFactory";
import IdGenerator from "util/IdGenerator";

interface InstanceServices {

	getDom(): Dom;

	getFactories(): Factories;

	logFactory(): LoggerFactory;

	idGenerator(): IdGenerator;

	getBehaviorsRegistry(): BehaviorsRegistry;

}

export default InstanceServices;
