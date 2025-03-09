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

	public removeAt(index: number): void {
		this.series.removeAt(index);
	}

	public addAt(index: number, component: Nestable): void {
		this.series.addAt(index, component);
	}

	public addAtEnd(component: Nestable): void {
		this.series.addAtEnd(component);
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