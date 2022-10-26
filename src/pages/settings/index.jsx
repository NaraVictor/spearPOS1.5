import PageTitle from "../../components/page-title";
import { useState } from "react";
import CategoriesComponent from "./components/categories";
import { Button, PageHeader } from "antd";
import GeneralSettings from "./general";

const SettingsPage = (props) => {
	const [page, setPage] = useState(0);
	return (
		<div className="content-container">
			<PageTitle title="Settings" />
			<div className="row">
				<div className="col-11">
					<div className="d-flex align-items-center justify-content-between my-4">
						<PageHeader
							ghost={false}
							title="Settings"
							className="site-page-header"
							onBack={() => window.history.go(-1)}
							subTitle="configurations and application level control"></PageHeader>
						<div className="d-flex">
							<Button
								type={page === 0 ? "primary" : "default"}
								size="large"
								className="d-flex align-items-center "
								onClick={() => setPage(0)}>
								Categories
							</Button>
							<Button
								type={page === 1 ? "primary" : "default"}
								size="large"
								className="d-flex align-items-center"
								onClick={() => setPage(1)}>
								General
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-11">
					{page === 0 && <CategoriesComponent />}
					{page === 1 && <GeneralSettings />}
				</div>
			</div>
		</div>
	);
};

export { SettingsPage };
