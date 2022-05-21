import { FC } from "react";
import { DndManager } from "../../core";
import Item from "./Item";
import Zone from "./Zone";

const data = {
	"1": ["a", "b"],
	"2": ["c", "d"],
	"3": ["e", "f"],
};

type key = keyof typeof data;

const Example01: FC = () => {
	return (
		<DndManager>
			{(Object.keys(data) as key[]).map((row) => (
				<Zone key={row} index={row}>
					{data[row].map((item) => (
						<Item key={item} index={item} />
					))}
				</Zone>
			))}
		</DndManager>
	);
};

export default Example01;
