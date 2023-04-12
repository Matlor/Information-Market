import React, { useState } from "react";
import { Meta, Story } from "@storybook/react";
import FixedWidthWrapper from "../../components/core/FixedWidthWrapper";

export default {
	title: "core/FixedWidthWrapper",
	component: FixedWidthWrapper,
} as Meta;

const Template: Story = () => {
	const [isSmall, setIsSmall] = useState(false);

	const toggleSize = () => {
		setIsSmall((prev) => !prev);
	};

	return (
		<FixedWidthWrapper>
			<div
				style={{
					background: "red",
					color: "white",
					padding: "10px",
					cursor: "pointer",
					transition: "all 0.2s ease-in-out",
					width: isSmall ? "50px" : "200px",
				}}
				onClick={toggleSize}
			>
				{isSmall ? "Small content" : "Some content"}
			</div>
		</FixedWidthWrapper>
	);
};

export const Default = Template.bind({});
