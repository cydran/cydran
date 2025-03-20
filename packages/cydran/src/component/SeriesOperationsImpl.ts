import { Nestable, SeriesOperations } from 'context/Context';
import Series from 'component/Series';
import { requireNotNull } from 'util/Utils';

class SeriesOperationsImpl implements SeriesOperations {

	private series: Series

	constructor(series: Series) {
		this.series = requireNotNull(series, "series");
	}

	public getAt<N extends Nestable>(index: number): N {
		return this.series.getAt(index);
	}

	public replaceAt(index: number, component: Nestable): void {
		this.series.replaceAt(index, component);
	}

	public remove(component: Nestable): void {
		this.series.remove(component);
	}

	public removeAt(index: number): void {
		this.series.removeAt(index);
	}

	public addAt(index: number, component: Nestable): void {
		this.series.addAt(index, component);
	}

	public addAsFirst(component: Nestable): void {
		this.series.addAsFirst(component);
	}

	public addAsLast(component: Nestable): void {
		this.series.addAsLast(component);
	}

	public hasComponents(): boolean {
		return this.series.hasComponents();
	}

	public isEmpty(): boolean {
		return this.series.isEmpty();
	}

	public clear(): void {
		this.series.clear();
	}

}

export default SeriesOperationsImpl;