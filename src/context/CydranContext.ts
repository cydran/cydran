import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import Dom from "dom/Dom";
import Factories from 'factory/Factories';
import BundleFactory from "i18n/BundleFactory";
import I18nResolvable from "interface/ables/I18nResolvable";
import Nameable from "interface/ables/Nameable";
import LoggerFactory from "log/LoggerFactory";
import IdGenerator from "util/IdGenerator";

interface CydranContext extends Nameable, I18nResolvable {

	getDom(): Dom;

	getFactories(): Factories;

	logFactory(): LoggerFactory;

	idGenerator(): IdGenerator;

	getBehaviorsRegistry(): BehaviorsRegistry;

	bundleFactory(): BundleFactory;

}

export default CydranContext;
