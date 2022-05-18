import { CSSProperties, FC, RefObject, useMemo } from "react";
import useDraggable from "../../core/hooks/useDraggable";

interface ItemProps {
	index: string;
}

const Item: FC<ItemProps> = ({ index }) => {
	const [ref, style, dragged] = useDraggable({ index });

	const dragStyle = useMemo<CSSProperties>(() => {
		if (dragged) {
			return {
				border: "5px dashed",
				borderColor: "green",
			};
		}

		return {};
	}, [dragged]);

	return (
		<div
			ref={ref as RefObject<HTMLDivElement>}
			style={{ ...style, ...dragStyle }}
			className="draggable"
			data-index={index}
		>
			{index}
		</div>
	);
};

export default Item;
