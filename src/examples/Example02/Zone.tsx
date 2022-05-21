import { CSSProperties, FC, ReactNode, RefObject, useMemo } from "react";
import useDroppable from "../../core/hooks/useDroppable";

interface ZoneProps {
	index: string;
	children?: ReactNode | ReactNode[];
}

const Zone: FC<ZoneProps> = ({ index, children }) => {
	const [Wrapper, ref, isUnder] = useDroppable({ index });

	const style = useMemo<CSSProperties>(() => {
		if (isUnder) {
			return {
				backgroundColor: "gray",
			};
		}

		return {};
	}, [isUnder]);

	return (
		<Wrapper>
			<div
				ref={ref as RefObject<HTMLDivElement>}
				className="droppable"
				data-index={index}
				style={style}
			>
				<p>{index}</p>
				{children}
			</div>
		</Wrapper>
	);
};

export default Zone;
