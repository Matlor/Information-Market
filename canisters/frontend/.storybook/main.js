module.exports = {
	stories: [
		"../src/stories/**/*.stories.mdx",
		"../src/stories/**/*.stories.@(js|jsx|ts|tsx)",
	],

	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		{
			name: "@storybook/addon-styling",
			options: {
				// Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
				// For more details on this addon's options.
			},
		},
	],
	framework: "@storybook/react",
	core: {
		builder: "@storybook/builder-vite",
	},
	features: {
		storyStoreV7: true,
	},
};
