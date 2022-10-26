import { format } from "date-fns";

const ExpiringProds = ( { products } ) =>
{
	return (
		<div className="rounded bg-white">
			<table className="table table-hover">
				<thead>
					<tr>
						<td>Product</td>
						<td>Available Stock</td>
						<td>Expiring(ed) Date</td>
					</tr>
				</thead>
				<tbody>
					{ products?.map( ( p ) => (
						<tr key={ p.id }>
							<td>{ p?.productName }</td>
							<td>{ p?.quantity }</td>
							<td>
								<strong>{ format( new Date( p?.expiryDate ),
									"EEE - MMMM dd, yyyy"
								) }</strong>
							</td>
						</tr>
					) ) }
				</tbody>
			</table>
		</div>
	);
};

export default ExpiringProds;
