import {
	CSSProperties,
	FC,
	RefObject,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import useDraggable from "../../core/hooks/useDraggable";

const distance = 75;

const CircleItem: FC = () => {
	const innerRef = useRef<Element>(null);

	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
	const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

	const onDragStart = useCallback<dragStartHandler>((e) => {
		setStartPoint({ x: e.clientX, y: e.clientY });

		if (innerRef.current) {
			const rect = innerRef.current.getBoundingClientRect();
			const style = getComputedStyle(innerRef.current);

			setOffset({
				x: e.clientX - rect.left + parseInt(style.marginLeft, 10),
				y: e.clientY - rect.top + parseInt(style.marginTop, 10),
			});
		}
	}, []);

	const onDrag = useCallback<dragHandler>(
		(e) => setEndPoint({ x: e.clientX, y: e.clientY }),
		[]
	);

	const [ref, dragStyle, dragged] = useDraggable({
		innerRef,
		index: "CircleItem",
		onDragStart,
		onDrag,
	});

	const style = useMemo<CSSProperties>(() => {
		if (dragged) {
			const vector = {
				x: endPoint.x - (startPoint.x + offset.x),
				y: endPoint.y - (startPoint.y + offset.y),
			};

			const vectorLength = (vector.x ** 2 + vector.y ** 2) ** 0.5;

			if (vectorLength < distance) {
				return dragStyle;
			}

			const angle = Math.atan2(vector.y, vector.x);

			const point = {
				x: startPoint.x + distance * Math.cos(angle),
				y: startPoint.y + distance * Math.sin(angle),
			};

			return {
				...dragStyle,
				top: point.y,
				left: point.x,
			};
		}

		return {};
	}, [
		dragStyle,
		dragged,
		endPoint.x,
		endPoint.y,
		offset.x,
		offset.y,
		startPoint.x,
		startPoint.y,
	]);

	return (
		<div
			ref={ref as RefObject<HTMLDivElement>}
			style={style}
			className="draggable"
		>
			CircleItem
		</div>
	);
};

export default CircleItem;
