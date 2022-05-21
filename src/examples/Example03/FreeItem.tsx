import { FC, RefObject } from "react";
import useDraggable from "../../core/hooks/useDraggable";

const FreeItem: FC = () => {
	const [ref, style] = useDraggable({ index: "FreeItem" });

	return (
		<div
			ref={ref as RefObject<HTMLDivElement>}
			style={style}
			className="draggable"
		>
			FreeItem
		</div>
	);
};

export default FreeItem;
