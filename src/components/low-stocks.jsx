import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
const LowStocks = ( { products } ) =>
{
	return (
		<div className="rounded bg-white">
			<Button
				type="primary">
				<Link to="/inventory/purchase-orders/new" className=" align-items-center">
					<PlusOutlined />
					Restock
				</Link>
			</Button>
			<table className="table table-hover">
				<thead>
					<tr>
						<td>Product</td>
						<td>Minimum Qty</td>
						<td>Available Qty</td>
					</tr>
				</thead>
				<tbody>
					{ products.map( ( p ) => (
						<tr key={ p.id }>
							<td>{ p.productName }</td>
							<td>{ p.minQty }</td>
							<td>
								<strong>{ p.quantity }</strong>
							</td>
						</tr>
					) ) }
				</tbody>
			</table>
		</div>
	);
};

export default LowStocks;
