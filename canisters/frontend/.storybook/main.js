module.exports = {
  stories: ["../src/stories/**/*.stories.mdx", "../src/stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", {
    name: "@storybook/addon-styling",
    options: {
      // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
      // For more details on this addon's options.
    }
  }],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  features: {
    storyStoreV7: true
  },
  docs: {
    autodocs: true
  }
};