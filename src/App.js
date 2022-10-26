import { HashRouter } from "react-router-dom";
import Routes from "./routes";
// styles
import "./static/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "antd/";
import "antd/dist/antd.css";
import "@splidejs/splide/dist/css/splide.min.css";
import "@splidejs/splide/dist/css/themes/splide-skyblue.min.css";
// import { createBrowserHistory, createHashHistory } from "history";
// import { isElectron } from "./helpers/utilities";
// import { useEffect } from "react";

// const history = isElectron() ? createHashHistory() : createBrowserHistory();

function App() {
	// useEffect(() => {
	// 	window.process = {
	// 		...window.process,
	// 	};
	// }, []);

	return (
		<div className="App">
			<HashRouter>
				<Routes />
			</HashRouter>
		</div>
	);
}

export default App;
