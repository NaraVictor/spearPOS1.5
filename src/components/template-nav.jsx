import { NavLink } from "react-router-dom";
import { getRole } from "../helpers/auth";

const AdminTemplateNav = ( props ) => {
	return (
		<nav className="nav">
			<ul className="nav-links">
				<li>
					<NavLink
						exact
						to="/"
						activeClassName="active-link"
						className="nav-link align-items-center pb-0">
						{/* <StarTwoTone className="h5" /> */ }
						<i className="bi bi-house h5"></i>
						<span className="mx-2">HOME</span>
					</NavLink>
					<ul className="deep-links">
						<NavLink
							to="/register"
							// className="link"
							activeClassName="active">
							Register
						</NavLink>
					</ul>
				</li>
				<>
					<li>
						<NavLink
							to="/inventory"
							className="nav-link align-items-center"
							activeClassName="active-link">
							{/* <PieChartTwoTone className="h5" /> */ }
							<i className="bi bi-box2 h5 mb-0"></i>
							<span className="mx-2">INVENTORY</span>
						</NavLink>
						<ul className="deep-links">
							<NavLink
								to="/inventory/sales"
								className="link"
								activeClassName="active">
								Sales
							</NavLink>

							{/* <li>
									<NavLink
										to="/inventory/orders"
									// className="link"

										activeClassName="active">
										Orders
									</NavLink>
								</li> */}
							<li>
								<NavLink
									to="/inventory/purchase-orders"
									className="link"
									activeClassName="active">
									Restocks
								</NavLink>
							</li>
						</ul>
					</li>
					{ getRole() !== "attendant" && (
						<li>
							<NavLink
								to="/business"
								activeClassName="active-link"
								className="nav-link align-items-center">
								{/* <ShoppingTwoTone className="h5" /> */ }
								<i className="bi bi-building h5 mb-0"></i>
								<span className="mx-2">BUSINESS</span>
							</NavLink>
							<ul className="deep-links">
								<NavLink
									to="/business/customers"
									className="link"
									activeClassName="active">
									Customers
								</NavLink>
								<NavLink
									to="/business/expenses"
									className="link"
									activeClassName="active">
									Expenses
								</NavLink>
								<NavLink
									to="/business/staffs"
									className="link"
									activeClassName="active">
									Staff
								</NavLink>
								<NavLink
									to="/business/suppliers"
									// disabled
									className="link mb-0"
									activeClassName="active"
								>
									Suppliers
									{/* <span className="text-danger">(PRO)</span> */ }
								</NavLink>
								<NavLink
									to="/business/audit"
									className="link mb-0"
									// disabled
									activeClassName="active">
									Reports
									{/* <span className="text-danger">(PRO)</span> */ }
								</NavLink>
							</ul>
						</li>
					) }
					{ getRole() !== ( "attendant" || "accounts" ) && (
						<li>
							<NavLink
								to="/settings"
								activeClassName="active-link"
								className="nav-link align-items-center">
								{/* <SettingTwoTone className="h5" /> */ }
								<i className="bi bi-gear h5 mb-0"></i>
								<span className="mx-2">SETTINGS</span>
							</NavLink>
							<ul className="mt-0 deep-links">
								<NavLink
									to="/settings/accounts"
									className="link"
									activeClassName="active">
									Users
								</NavLink>
								<NavLink
									to="/settings/logs"
									className="link mb-0"
									activeClassName="active">
									Logs
									{/* <span className="text-danger">(PRO)</span> */ }
								</NavLink>
							</ul>
						</li>
					) }
				</>
			</ul>
		</nav>
	);
};

export default AdminTemplateNav;
