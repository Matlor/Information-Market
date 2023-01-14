import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./screens/App";
import { HashRouter } from "react-router-dom";

// to fix decoder of agent-js
window.global = window;

// to fix plug
declare global {
	interface Window {
		ic: any;
	}
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<HashRouter>
		<App />
	</HashRouter>
);
