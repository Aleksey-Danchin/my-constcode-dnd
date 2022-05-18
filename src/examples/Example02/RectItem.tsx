import {
	CSSProperties,
	FC,
	RefObject,
	useCallback,
	useMemo,
	useState,
} from "react";
import useDraggable from "../../core/hooks/useDraggable";

const distance = 75;

const RectItem: FC = () => {
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

	const onDragStart = useCallback<dragStartHandler>(
		(e) => setStartPoint({ x: e.clientX, y: e.clientY }),
		[]
	);

	const [ref, dragStyle, dragged] = useDraggable({
		index: "RectItem",
		onDragStart,
	});

	const style = useMemo<CSSProperties>(() => {
		if (dragged) {
			return {
				...dragStyle,
				top: Math.max(
					startPoint.y - distance,
					Math.min(startPoint.y + distance, dragStyle.top as number)
				),

				left: Math.max(
					startPoint.x - distance,
					Math.min(startPoint.x + distance, dragStyle.left as number)
				),
			};
		}

		return {};
	}, [dragStyle, dragged, startPoint.x, startPoint.y]);

	return (
		<div
			ref={ref as RefObject<HTMLDivElement>}
			style={style}
			className="draggable"
		>
			RectItem
		</div>
	);
};

export default RectItem;
