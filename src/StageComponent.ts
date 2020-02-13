import { COMPONENT_INTERNALS_FIELD_NAME, MODULE_FIELD_NAME } from "@/Constants";
import StageComponentInternals from "@/StageComponentInternals";
import { ComponentIdPair, ComponentConfigImpl, ComponentConfig } from "@/ComponentConfig";
import Component from "@/Component";
import ModuleImpl from "@/ModuleImpl";

class StageComponent extends Component {

	constructor(selector: string, topComponentIds: ComponentIdPair[], bottomComponentIds: ComponentIdPair[]) {
		const config: ComponentConfigImpl = new ComponentConfigImpl();
		config.setTopComponentIds(topComponentIds);
		config.setBottomComponentIds(bottomComponentIds);
		super(selector, config);
	}

	public setComponent(component: Component): StageComponent {
		this.setChild("body", component);

		return this;
	}

	public isConnected(): boolean {
		return true;
	}

	protected ____internal$$cydran$$init____(template: string, config: ComponentConfig): void {
		this[COMPONENT_INTERNALS_FIELD_NAME] = new StageComponentInternals(this, template, config);
		this[COMPONENT_INTERNALS_FIELD_NAME]["init"]();
	}
}

StageComponent["prototype"][MODULE_FIELD_NAME] = ModuleImpl.DEFAULT_MODULE;

export default StageComponent;
