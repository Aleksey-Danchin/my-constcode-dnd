export const isIntersection = <T>(a: Array<T>, b: Array<T>): boolean => {
	for (const i of a) {
		if (b.includes(i)) {
			return true;
		}
	}

	for (const i of b) {
		if (a.includes(i)) {
			return true;
		}
	}

	return false;
};

export const isEqualArray = <T>(a: Array<T>, b: Array<T>): boolean => {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
};
