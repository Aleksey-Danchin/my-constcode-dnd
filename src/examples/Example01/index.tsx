import { FC, useCallback, useState } from "react";
import { DndManager } from "../../core";
import { dropHandler } from "../../core/types";
import Item from "./Item";
import Zone from "./Zone";

const data = {
	"1": ["a", "b"],
	"2": ["c", "d"],
	"3": ["e", "f"],
};

type key = keyof typeof data;

const Example01: FC = () => {
	const [state, setState] = useState(data);

	const onDrop = useCallback<dropHandler>((e, draggable, droppable) => {
		setState((state) => {
			state = JSON.parse(JSON.stringify(state));

			const sourceRow = state[draggable.source as key];
			const sourceIndex = sourceRow.indexOf(draggable.index);

			const destinationRow = state[droppable.index as key];
			const destinationIndex = droppable.targets.length
				? destinationRow.indexOf(droppable.targets[0])
				: destinationRow.length;

			sourceRow.splice(sourceIndex, 1);
			destinationRow.splice(destinationIndex, 0, draggable.index);

			return state;
		});
	}, []);

	return (
		<DndManager onDrop={onDrop}>
			{(Object.keys(state) as key[]).map((row) => (
				<Zone key={row} index={row}>
					{state[row].map((item) => (
						<Item key={item} index={item} />
					))}
				</Zone>
			))}
		</DndManager>
	);
};

export default Example01;
