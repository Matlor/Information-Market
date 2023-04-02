// Sort.stories.tsx
import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import { Sort } from "../../components/browseQuestion/Sort";

export default {
	title: "browseQuestion/Sort",
	component: Sort,
} as Meta;

const Template: Story<any> = (args) => {
	const [sortOrder, setSortOrder] = useState({
		orderBy: "REWARD",
		orderDirection: "ASCD",
	});

	const handleSetSortOrder = (orderBy) => {
		const newDirection =
			sortOrder.orderBy === orderBy && sortOrder.orderDirection === "ASCD"
				? "DESC"
				: "ASCD";

		setSortOrder({ orderBy, orderDirection: newDirection });
	};

	return (
		<Sort
			{...args}
			order={sortOrder}
			setSortOrder={(orderBy) => handleSetSortOrder(orderBy)}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {
	isLoading: false,
};
