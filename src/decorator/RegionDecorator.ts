import {Decorator} from "../Core";

class RegionDecorator extends Decorator<string> {

	public wire(): void {
		let name: string = this.getExpression();
		this.getEl().setAttribute('data-region-id', name);
		this.getParentView().getRegion(name).setEl(this.getEl());
	}

	public unwire(): void {
		let name: string = this.getExpression();
		this.getParentView().getRegion(name).setEl(null);
	}

	protected onTargetChange(previous: any, current: any): void {
		// Intentionally do nothing
	}

	public evaluateModel(): void {
		// Prevent method evaluation
	}

}

export default RegionDecorator;