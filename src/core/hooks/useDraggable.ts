import {
	createRef,
	CSSProperties,
	RefObject,
	useEffect,
	useMemo,
	useState,
} from "react";

import useDndManager from "../hooks/useDndManager";
import useDroppableContext from "../hooks/useDroppableContext";
import useKind from "../hooks/useKind";
import {
	dragEndHandler,
	dragHandler,
	dragStartHandler,
	IDndDraggableMember,
	IDroppableContext,
} from "../types";
import { isIntersection } from "../util";
import useHandles from "./useHandles";

interface useDraggableProps {
	innerRef?: RefObject<Element>;
	index: string;
	kind?: string[];
	handles?: Array<RefObject<Element | HTMLElement>>;

	onDragStart?: dragStartHandler;
	onDrag?: dragHandler;
	onDragEnd?: dragEndHandler;
}

const kindDefault = [""];

const startselectHandler = (e: Event) => {
	e.preventDefault();
	e.stopPropagation();
};

const useDraggable = ({
	innerRef,
	index,
	kind = kindDefault,
	handles = [],

	onDragStart,
	onDrag,
	onDragEnd,
}: useDraggableProps): [RefObject<Element>, CSSProperties, Boolean] => {
	const [dragged, setDragged] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	const {
		mouse,
		droppable,
		draggable,
		prevDraggable,
		addDraggableMemeber,
		removeDraggableMemeber,

		onDragStart: managerDragStartHandler,
		onDrag: managerDragHandler,
		onDragEnd: managerDragEndHandler,
	} = useDndManager();

	const myKind = useKind(kind);

	const ref = useMemo(
		() => (innerRef ? innerRef : createRef<Element>()),
		[innerRef]
	);

	const myHandles = useHandles(ref, handles);

	const droppableParent = useDroppableContext();

	const source = useMemo(() => {
		let parent: IDroppableContext | undefined = droppableParent;

		while (parent) {
			if (isIntersection(parent.kind, myKind)) {
				return parent.index;
			}

			parent = parent.parent;
		}

		return null;
	}, [droppableParent, myKind]);

	const style = useMemo<CSSProperties>(() => {
		if (dragged) {
			return {
				position: "fixed",
				top: mouse.y - offset.y,
				left: mouse.x - offset.x,
			};
		}

		return {};
	}, [dragged, mouse.x, mouse.y, offset.x, offset.y]);

	useEffect(() => {
		if (ref.current) {
			const { current } = ref;

			const memeber: IDndDraggableMember = {
				index,
				handles: myHandles,
				kind: myKind,
				element: current,
				source,
			};

			addDraggableMemeber(memeber);

			return () => {
				removeDraggableMemeber(memeber);
			};
		}
	}, [
		addDraggableMemeber,
		index,
		myHandles,
		myKind,
		ref,
		removeDraggableMemeber,
		source,
	]);

	useEffect(() => {
		const elements: Array<Element> = [];

		for (const handle of myHandles) {
			if (handle.current) {
				elements.push(handle.current);
			}
		}

		if (elements.length) {
			for (const element of elements) {
				element.addEventListener("selectstart", startselectHandler);
			}

			return () => {
				for (const element of elements) {
					element.removeEventListener(
						"selectstart",
						startselectHandler
					);
				}
			};
		}
	}, [myHandles]);

	useEffect(() => {
		if (
			draggable &&
			draggable.element === ref.current &&
			!dragged &&
			mouse.dx | mouse.dy
		) {
			setDragged(true);

			const rect = ref.current.getBoundingClientRect();
			const style = getComputedStyle(ref.current);

			setOffset({
				x: mouse.x - rect.left + (parseInt(style.marginLeft) || 0),
				y: mouse.y - rect.top + (parseInt(style.marginTop) || 0),
			});

			window.addEventListener("selectstart", startselectHandler);

			if (onDragStart) {
				onDragStart(mouse.event, draggable, droppable);
			}

			if (managerDragStartHandler) {
				managerDragStartHandler(mouse.event, draggable, droppable);
			}
		}
	}, [
		draggable,
		droppable,
		dragged,
		mouse.dx,
		mouse.dy,
		mouse.event,
		mouse.x,
		mouse.y,
		onDragStart,
		ref,
		managerDragStartHandler,
	]);

	useEffect(() => {
		if (draggable && dragged && mouse.dx | mouse.dy) {
			if (onDrag) {
				onDrag(mouse.event, draggable, droppable);
			}

			if (managerDragHandler) {
				managerDragHandler(mouse.event, draggable, droppable);
			}
		}
	}, [
		draggable,
		dragged,
		mouse.dx,
		mouse.dy,
		mouse.event,
		onDrag,
		droppable,
		managerDragHandler,
	]);

	useEffect(() => {
		if (dragged && !draggable && prevDraggable) {
			setDragged(false);

			window.removeEventListener("selectstart", startselectHandler);

			if (onDragEnd) {
				onDragEnd(mouse.event, prevDraggable, droppable);
			}

			if (managerDragEndHandler) {
				managerDragEndHandler(mouse.event, prevDraggable, droppable);
			}
		}
	}, [
		draggable,
		dragged,
		mouse.event,
		onDragEnd,
		prevDraggable,
		droppable,
		managerDragEndHandler,
	]);

	return [ref, style, dragged];
};

export default useDraggable;
