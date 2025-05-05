import Type from 'interface/Type';
import CreatorStrategy from 'registry/creator/CreatorStrategy';
import Instantiator from 'registry/Instantiator';
import { requireNotNull } from 'util/Utils';

class ClassCreatorStrategyImpl<T> implements CreatorStrategy<T> {

	private classInstance: Type<T>;

	constructor(classInstance: Type<T>) {
		this.classInstance = requireNotNull(classInstance, "classInstance");
	}

	public create(): (argumentValues: unknown[]) => T {
		return Instantiator.create(this.classInstance);
	}

	public $release(): void {
		this.classInstance = null;
	}

}

export default ClassCreatorStrategyImpl;
