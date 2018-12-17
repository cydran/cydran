import {Decorator} from "../Core";

class SelectOptionsElementDecorator extends Decorator<string> {

	public wire(): void {
		const value: any = this.getMediator().get();
		this.onTargetChange(null, value);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		const el: HTMLElement = this.getEl();

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		const items: {name: string; value: string;}[] = current;

		let child: HTMLElement = el.appendChild(document.createElement('option'));
		child.innerHTML = 'Select...';
		child.setAttribute('selected', 'selected');
		child.setAttribute('disabled', 'disabled');
		child['value'] = '';

		for (var i = 0;i < items.length;i++) {
			let item: {name: string; value: string;} = items[i];
			let child: HTMLElement = el.appendChild(document.createElement('option'));
			child.innerHTML = item.name;
			child['value'] = item.value;
		}
	}

}

export default SelectOptionsElementDecorator;