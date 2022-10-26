import { Route } from "react-router-dom";
import { getRole, isAuthenticated } from "./auth";
import AdminTemplate from "./../components/admin-template";
import { Redirect } from "react-router-dom";
import NotAuthorized from "../pages/not-authorized";

// function CustomRoute({ hideNav = false, component: Component, ...rest }) {
// 	return (
// 		<Route
// 			{...rest}
// 			render={(props) =>
// 				hideNav ? (
// 					<Component {...props} />
// 				) : (
// 					<>
// 						<NavBar />
// 						<Component {...props} />
// 					</>
// 				)
// 			}
// 		/>
// 	);
// }

function CustomRoute({
	component: Component,
	roles = ["admin", "accounts", "manager"],
	...rest
}) {
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() ? (
					roles.includes(getRole()) || roles === "all" ? (
						<AdminTemplate>
							<Component {...props} />
						</AdminTemplate>
					) : (
						<NotAuthorized />
					)
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
}

export { CustomRoute };
