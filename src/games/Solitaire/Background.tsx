import { FC, ReactNode } from "react";

interface BackgroundProps {
	color?: string;
	children: ReactNode | ReactNode[];
}

const Background: FC<BackgroundProps> = ({ color = "green", children }) => {
	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				backgroundColor: color,
			}}
		>
			{children}
		</div>
	);
};

export default Background;
