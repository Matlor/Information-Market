import { Provider } from "@psychedelic/plug-inpage-provider";

console.log(Provider, "provider");
const ua = navigator.userAgent.toLowerCase();
const isAndroid = ua.indexOf("android") > -1;
const isApple = ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1;

const isMobile = isAndroid || isApple;

if (!window.ic?.plug && isMobile) {
	Provider.exposeProviderWithWalletConnect({ window, debug: true });
}

export const plug = window.ic?.plug;
