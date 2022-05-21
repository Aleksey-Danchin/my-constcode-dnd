import { FC } from "react";
import { DndManager } from "../../core";
import FreeItem from "./FreeItem";
import RectItem from "./RectItem";
import CircleItem from "./CircleItem";
import StepItem from "./StepItem";

const Example01: FC = () => {
	return (
		<DndManager>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-around",
					}}
				>
					<FreeItem />
					<RectItem />
					<CircleItem />
					<StepItem />
				</div>
			</div>
		</DndManager>
	);
};

export default Example01;
