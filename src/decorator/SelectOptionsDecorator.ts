import {Decorator} from "../Core";

class SelectOptionsElementDecorator extends Decorator<string> {

	public wire(): void {
		let value: any = this.getTarget();
		this.onTargetChange(value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		let el: HTMLElement = this.getEl();

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		let items: {name: string; value: string;}[] = value;

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