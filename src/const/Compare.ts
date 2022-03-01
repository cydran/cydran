const COMPARE: any = {
	alpha: (first: string, second: string) => {
		return (first < second) ? -1 : ((first > second) ? 1 : 0);
	}
};

export default COMPARE;
