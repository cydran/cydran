const COMPARE: any = {
	alpha: (first: string, second: string) => {
		let result: number = 0;

		if (first < second) {
			result = -1;
		} else if (first > second) {
			result = 1;
		}

		return result;
	},
};

export default COMPARE;
