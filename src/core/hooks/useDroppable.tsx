import {
	createRef,
	FC,
	ReactNode,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import DroppableContext from "../contexts/DroppableContext";
import useDndManager from "../hooks/useDndManager";
import useDroppableContext from "../hooks/useDroppableContext";
import useKind from "../hooks/useKind";

interface useDroppableProps {
	innerRef?: RefObject<Element>;
	index: string;
	kind?: string[];

	onDragEnter?: dragEnterHandler;
	onDragLeave?: dragLeaveHandler;
	onDragOver?: dragOverHandler;
	onDrop?: dropHandler;
}

const kindDefault = [""];

const useDroppable = ({
	innerRef,
	index,
	kind = kindDefault,

	onDragEnter,
	onDragLeave,
	onDragOver,
	onDrop,
}: useDroppableProps): [
	FC<{ children: ReactNode | ReactNode[] }>,
	RefObject<Element>,
	Boolean
] => {
	const [zonned, setZonned] = useState(false);

	const {
		mouse,
		draggable,
		prevDraggable,
		droppable,
		prevDroppable,
		addDroppableMember,
		removeDroppableMember,
		onDragEnter: managerDragEnterHandler,
		onDragLeave: managerDragLeaveHandler,
		onDragOver: managerDragOverHandler,
		onDrop: managerDropHandler,
	} = useDndManager();

	const parent = useDroppableContext();

	const myKind = useKind(kind);

	const ref = useMemo(
		() => (innerRef ? innerRef : createRef<Element>()),
		[innerRef]
	);

	const value = useMemo(
		() => ({ index, parent, kind: myKind }),
		[index, parent, myKind]
	);

	useEffect(() => {
		if (ref.current) {
			const { current } = ref;

			const member: IDndMember = {
				index,
				kind: myKind,
				element: current,
			};

			addDroppableMember(member);

			return () => removeDroppableMember(member);
		}
	}, [addDroppableMember, index, myKind, ref, removeDroppableMember]);

	useEffect(() => {
		if (
			droppable &&
			draggable &&
			droppable.element === ref.current &&
			!zonned &&
			mouse.dx | mouse.dy
		) {
			setZonned(true);

			if (onDragEnter) {
				onDragEnter(mouse.event, draggable, droppable);
			}

			if (managerDragEnterHandler) {
				managerDragEnterHandler(mouse.event, draggable, droppable);
			}
		}
	}, [
		draggable,
		droppable,
		managerDragEnterHandler,
		mouse.dx,
		mouse.dy,
		mouse.event,
		onDragEnter,
		ref,
		zonned,
	]);

	useEffect(() => {
		if (draggable && droppable && zonned && mouse.dx | mouse.dy) {
			if (onDragOver) {
				onDragOver(mouse.event, draggable, droppable);
			}

			if (managerDragOverHandler) {
				managerDragOverHandler(mouse.event, draggable, droppable);
			}
		}
	}, [
		draggable,
		droppable,
		managerDragOverHandler,
		mouse.dx,
		mouse.dy,
		mouse.event,
		onDragOver,
		zonned,
	]);

	useEffect(() => {
		if (
			zonned &&
			draggable &&
			prevDroppable &&
			prevDroppable.element === ref.current &&
			(!droppable || droppable.element !== ref.current)
		) {
			setZonned(false);

			if (onDragLeave) {
				onDragLeave(mouse.event, draggable, prevDroppable);
			}

			if (managerDragLeaveHandler) {
				managerDragLeaveHandler(mouse.event, draggable, prevDroppable);
			}
		}
	}, [
		draggable,
		droppable,
		managerDragLeaveHandler,
		mouse.event,
		onDragLeave,
		prevDroppable,
		ref,
		zonned,
	]);

	useEffect(() => {
		if (zonned && !draggable && prevDraggable) {
			setZonned(false);

			if (prevDroppable && prevDroppable.element === ref.current) {
				if (onDrop) {
					onDrop(mouse.event, prevDraggable, prevDroppable);
				}

				if (managerDropHandler) {
					managerDropHandler(
						mouse.event,
						prevDraggable,
						prevDroppable
					);
				}
			}
		}
	}, [
		draggable,
		mouse.event,
		onDrop,
		managerDropHandler,
		prevDraggable,
		prevDroppable,
		ref,
		zonned,
	]);

	const Wrapper = useCallback<FC<{ children: ReactNode | ReactNode[] }>>(
		({ children }) => (
			<DroppableContext.Provider value={value}>
				{children}
			</DroppableContext.Provider>
		),
		[value]
	);

	return [Wrapper, ref, zonned];
};

export default useDroppable;
