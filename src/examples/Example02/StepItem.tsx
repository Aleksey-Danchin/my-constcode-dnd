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

const distance = 25;

const StepItem: FC = () => {
	const innerRef = useRef<Element>(null);

	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

	const onDragStart = useCallback<dragStartHandler>((e) => {
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
		index: "StepItem",
		onDragStart,
		onDrag,
	});

	const style = useMemo<CSSProperties>(() => {
		if (dragged) {
			const point = {
				x: endPoint.x - offset.x,
				y: endPoint.y - offset.y,
			};

			return {
				...dragStyle,
				top: distance * Math.ceil(point.y / distance),
				left: distance * Math.ceil(point.x / distance),
			};
		}

		return {};
	}, [dragStyle, dragged, endPoint.x, endPoint.y, offset.x, offset.y]);

	return (
		<div
			ref={ref as RefObject<HTMLDivElement>}
			style={style}
			className="draggable"
		>
			StepItem
		</div>
	);
};

export default StepItem;
