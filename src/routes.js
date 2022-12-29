import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

//pages
import {
	AccountsPage,
	BusinessPage,
	CustomersPage,
	DashboardPage,
	StaffsPage,
	InventoryPage,
	LogsPage,
	ProductsPage,
	PurchaseOrderPage,
	ReportsPage,
	SalesPage,
	SettingsPage,
	ExpensesPage,
	LoginPage,
	ChangePassword,
	PosPage,
	SuppliersPage,
	RegisterPage,
} from "./pages";
import SignUpPage from "./pages/auth/signup";

// components
import { CustomRoute } from "./helpers/route";
import NotFoundPage from "./pages/not-found";
import PurchaseOrderForm from "./components/purchase-order-new";

const Routes = (props) => {
	return (
		<div className="page-container">
			<Switch>
				<CustomRoute roles={"all"} path="/" exact component={DashboardPage} />
				<CustomRoute
					roles={"all"}
					path="/register"
					exact
					component={RegisterPage}
				/>
				<CustomRoute path="/pos" roles={"all"} exact component={PosPage} />
				<CustomRoute path="/business" exact component={BusinessPage} />
				<CustomRoute
					path="/inventory"
					roles={"all"}
					exact
					component={InventoryPage}
				/>
				<CustomRoute
					path="/Settings"
					roles={["admin", "manager"]}
					exact
					component={SettingsPage}
				/>

				{/* inventory */}
				<CustomRoute
					path="/inventory/products"
					roles={"all"}
					exact
					component={ProductsPage}
				/>
				<CustomRoute
					roles={"all"}
					path="/inventory/sales"
					exact
					component={SalesPage}
				/>
				{/* <CustomRoute path="/inventory/orders" exact component={OrdersPage} /> */}
				<CustomRoute
					path="/inventory/purchase-orders"
					exact
					roles={"all"}
					component={PurchaseOrderPage}
				/>
				<CustomRoute
					path="/inventory/purchase-orders/new"
					exact
					component={PurchaseOrderForm}
				/>

				{/* business */}
				<CustomRoute
					path="/business/customers"
					exact
					component={CustomersPage}
				/>
				<CustomRoute
					path="/business/suppliers"
					exact
					roles={["admin", "manager"]}
					component={SuppliersPage}
				/>
				<CustomRoute
					path="/business/staffs"
					roles={["admin", "manager"]}
					exact
					component={StaffsPage}
				/>

				<CustomRoute
					path="/business/audit"
					roles={["admin", "manager"]}
					exact
					component={ReportsPage}
				/>
				<CustomRoute
					path="/business/expenses"
					roles={["admin", "manager"]}
					exact
					component={ExpensesPage}
				/>

				{/* settings */}
				<CustomRoute
					path="/settings/accounts"
					roles={["admin", "manager"]}
					exact
					component={AccountsPage}
				/>
				<CustomRoute
					path="/settings/logs"
					roles={["admin", "manager"]}
					exact
					component={LogsPage}
				/>
				<Route path="/login" component={LoginPage} />
				<Route path="/change-password" component={ChangePassword} />
				<Route path="/signup" component={SignUpPage} />

				{/* redirect to 404 page */}
				<Route path="/index.html" component={LoginPage} />
				<Route path="/not-found" component={NotFoundPage} />
				<Redirect to="/not-found" />
			</Switch>
		</div>
	);
};

export default Routes;
