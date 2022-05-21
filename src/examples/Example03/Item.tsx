import { CSSProperties, FC, RefObject, useMemo, useRef } from "react";
import useDraggable from "../../core/hooks/useDraggable";

interface ItemProps {
	index: string;
}

const Item: FC<ItemProps> = ({ index }) => {
	const handle1 = useRef<Element>(null);
	const handle2 = useRef<Element>(null);

	const [ref, style, dragged] = useDraggable({
		index,
		handles: [handle1, handle2],
	});

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
			<div
				ref={handle1 as RefObject<HTMLDivElement>}
				style={{
					width: 10,
					height: 10,
					backgroundColor: "green",
				}}
			></div>
			{index}
			<div
				ref={handle2 as RefObject<HTMLDivElement>}
				style={{
					width: 10,
					height: 10,
					backgroundColor: "green",
				}}
			></div>
		</div>
	);
};

export default Item;
