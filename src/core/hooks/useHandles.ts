import { RefObject, useEffect, useState } from "react";
import { isEqualArray } from "../util";

const useHandles = (
	main: RefObject<Element>,
	handles?: Array<RefObject<Element>>
) => {
	const [myHandles, setMyHandels] = useState<Array<RefObject<Element>>>([]);

	useEffect(() => {
		setMyHandels((myHandles) => {
			let nextMyHandles: Array<RefObject<Element>> = [];

			if (handles && handles.length) {
				nextMyHandles = handles;
			} else {
				nextMyHandles = [main];
			}

			if (isEqualArray(myHandles, nextMyHandles)) {
				return myHandles;
			}

			return nextMyHandles;
		});
	}, [handles, main]);

	return myHandles;
};

export default useHandles;
