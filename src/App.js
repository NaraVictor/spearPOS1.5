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

// const CryptoJS = require( "crypto-js" ); //for api

// import { createBrowserHistory, createHashHistory } from "history";
// import { isElectron } from "./helpers/utilities";
// import { useEffect } from "react";

// const history = isElectron() ? createHashHistory() : createBrowserHistory();

function App () {
	// useEffect(() => {
	// 	window.process = {
	// 		...window.process,
	// 	};
	// }, []);
	// const key = "9781928124132"
	// const dbpwd = CryptoJS.AES.encrypt( "packaged", key ).toString();
	// const dbname = CryptoJS.AES.encrypt( "spearPOS_db", key ).toString();
	// const dbuser = CryptoJS.AES.encrypt( "postgres", key ).toString();
	// const jwt = CryptoJS.AES.encrypt( "someSup3rS3cretK3y", key ).toString();

	// for api
	// console.log( 'encrypted db pwd: ', dbpwd );
	// console.log( 'encrypted db name: ', dbname );
	// console.log( 'encrypted db user: ', dbuser );
	// console.log( 'encrypted jwt key: ', jwt );

	return (
		<div className="App">
			<HashRouter>
				<Routes />
			</HashRouter>
		</div>
	);
}

export default App;
