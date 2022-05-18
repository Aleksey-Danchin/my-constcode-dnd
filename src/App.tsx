import { FC, useState } from "react";

import Example01 from "./examples/Example01";
import Example02 from "./examples/Example02";

import "./style.css";

const examples = [Example01, Example02];

const App: FC = () => {
	const [example, setExample] = useState(0);

	const Example = examples[example];

	return (
		<>
			<select
				value={example}
				onChange={(e) => setExample(parseInt(e.target.value, 10))}
			>
				{examples.map((_, i) => (
					<option key={i} value={i}>
						Пример {i + 1}
					</option>
				))}
			</select>

			<div>
				<Example />
			</div>
		</>
	);
};

export default App;
