import { Divider } from "antd";

const CustomerDetail = ( { data } ) =>
{

	return (
		<div className="row">
			<div className="col-12">
				<h5>Customer Name: </h5> { data?.name }
			</div>
			<Divider />
			<div className="col-12">
				<h5>Customer Contacts: </h5> { data?.primaryContact } { data?.secondaryContact && " / " + data?.secondaryContact }
			</div>
			<Divider />
			<div className="col-12">
				<h5>Gender: </h5> { data?.gender }
			</div>
			<Divider />
			<div className="col-12">
				<h5>Category: </h5> { data?.category }
			</div>
			<Divider />
			<div className="col-12">
				<h5>Address: </h5> { data?.address }
			</div>
			<Divider />
			<div className="col-12">
				<h5>Email: </h5> { data?.email }
			</div>
		</div>
	);
};

export default CustomerDetail;
