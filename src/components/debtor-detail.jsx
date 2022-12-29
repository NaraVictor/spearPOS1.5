import { MoneyCollectFilled, CheckCircleOutlined } from "@ant-design/icons";
import { Divider, Tabs } from "antd";
import { format, isToday, isYesterday } from "date-fns";
import { cedisLocale } from "../helpers/utilities";
import DebtorPayment from "./debtor-payments";
import DebtorSaleLine from "./debtor-sale-line";

const DebtorDetail = ( { data } ) =>
{
	const { TabPane } = Tabs;
	const balance = ( parseFloat( data.sumAmt ) - parseFloat( data.discount ) ) - parseFloat( data.amountPaid )

	return (
		<div className="row">
			<div className="col-4">
				{/* <h5>Customer</h5>
					<Divider /> */}
				<div>
					<h6>{ data?.customer?.name || 'No name' } ({ data?.customer?.primaryContact }) </h6>
					customer name
				</div>
				<Divider />
				<div>
					<h6>{ data.paymentMethod } </h6>
					payment method
				</div>
				<Divider />
				<div>
					<h6>{ data.receiptNumber } </h6>
					sale receipt
				</div>
				<Divider />
				<div>
					<h6>{ data.user.staff.firstName + " " + data.user.staff.lastName } </h6>
					Staff
				</div>
				<Divider />
				<div className="alert alert-info">

					<span className="d-flex">
						<p className="me-3">Date: </p> <strong>{ isToday( new Date( data.saleDate ) )
							? "Today"
							: isYesterday( new Date( data.saleDate ) )
								? "Yesterday"
								: format( new Date( data.saleDate ), "EEE MMM d, yy" ) }</strong>
					</span>
					<span className="d-flex">
						<p className="me-3">Total Cost: </p> <strong>{ cedisLocale.format( data.sumAmt ) }</strong>
					</span>
					<span className="d-flex">
						<p className="me-3">Discount: </p> <strong>{ cedisLocale.format( data.discount ) }</strong>
					</span>
					<span className="d-flex">
						<p className="me-3">Total Paid: </p> <strong>{ cedisLocale.format( data.amountPaid ) }</strong>
					</span>
					<span className="d-flex">
						<p className="me-3">Balance: </p> <strong>{ cedisLocale.format( balance ) }</strong>
					</span>
				</div>
			</div>
			<div className="col-8">
				<Tabs defaultActiveKey="1">
					<TabPane
						tab={
							<span className="d-flex align-items-center">
								<MoneyCollectFilled />
								Payments
							</span>
						}
						key="1">
						<DebtorPayment saleId={ data.id } />
					</TabPane>
					<TabPane
						tab={
							<span className="d-flex align-items-center">
								<CheckCircleOutlined />
								Sale Items
							</span>
						}
						key="2">
						<DebtorSaleLine saleId={ data.id } />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

export default DebtorDetail;
