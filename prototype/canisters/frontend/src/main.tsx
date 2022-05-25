import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// to fix decoder of agent-js
window.global = window;

// to fix plug
declare global {
	interface Window {
		ic: any;
	}
}

let ic = window.ic;

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
