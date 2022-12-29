import PageTitle from "../../components/page-title";
import { PageHeader, Button } from "antd";
import { useState } from "react";
import { AuditSalesComponent } from "./components/audits/sales";
import { AuditProductComponent } from "./components/audits/products";
import { AuditExpenseComponent } from "./components/audits/expenses";
import { AuditPurchasesComponent } from "./components/audits/purchases";
import { AuditDebtorsComponent } from "./components/audits/debtors";

const ReportsPage = ( props ) =>
{
	const [ page, setPage ] = useState( 0 );
	return (
		<>
			<PageTitle title="Reports" />
			<div className="d-flex align-items-center justify-content-between my-4">
				<PageHeader
					ghost={ false }
					title="Reports"
					className="site-page-header"
					onBack={ () => window.history.go( -1 ) }
					subTitle="perform analysis and audit on data"></PageHeader>
				<div className="d-flex">
					<Button
						type={ page === 0 ? "primary" : "default" }
						size="large"
						className="d-flex align-items-center "
						onClick={ () => setPage( 0 ) }>
						Products
					</Button>
					<Button
						type={ page === 1 ? "primary" : "default" }
						size="large"
						className="d-flex align-items-center"
						onClick={ () => setPage( 1 ) }>
						Sales
					</Button>
					<Button
						type={ page === 4 ? "primary" : "default" }
						size="large"
						className="d-flex align-items-center"
						onClick={ () => setPage( 4 ) }>
						Debtors
					</Button>
					<Button
						type={ page === 2 ? "primary" : "default" }
						size="large"
						className="d-flex align-items-center"
						onClick={ () => setPage( 2 ) }>
						Expenses
					</Button>
					<Button
						type={ page === 3 ? "primary" : "default" }
						size="large"
						className="d-flex align-items-center"
						onClick={ () => setPage( 3 ) }>
						Restocks
					</Button>
				</div>
			</div>
			<div className="content-container">
				<div className="shadow-sm bg-white p-3">
					<div className="row">
						<div className="col-12">
							{ page === 0 && <AuditProductComponent /> }
							{ page === 1 && <AuditSalesComponent /> }
							{ page === 2 && <AuditExpenseComponent /> }
							{ page === 3 && <AuditPurchasesComponent /> }
							{ page === 4 && <AuditDebtorsComponent /> }
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export { ReportsPage };
