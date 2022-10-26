import { useEffect, useState } from "react";
import { fetchData } from "../helpers/api";
import { ErrorBoundary } from "./error-boundary";

const SupplierDetail = ( { data } ) =>
{
	const [ prods, setProds ] = useState( [] )

	const fetchProds = ( id ) =>
	{
		fetchData( `suppliers/${ id }/products` ).then(
			res =>
			{
				res.status === 200 && (
					setProds( res.data.data )
				)
			}
		)
	}

	useEffect( () =>
	{
		fetchProds( data.id )
	}, [ data ] )


	return (
		<>
			<div className="row">
				<div className="col-5">
					<ErrorBoundary >
						<div className="d-flex">
							<h6>Supplier Name: </h6>
							<p className="ms-3">
								{ data.supplierName }
							</p>
						</div>
						<div className="d-flex">
							<h6>Contact: </h6>
							<p className="ms-3">
								{ data.contact }
							</p>
						</div>
						<div className="d-flex">
							<h6>Email: </h6>
							<p className="ms-3">
								{ data.email }
							</p>
						</div>
						<div className="d-flex">
							<h6>Location: </h6>
							<p className="ms-3">
								{ data.location }
							</p>
						</div>
						<div className="d-flex">
							<h6>Products Count: </h6>
							<p className="ms-3">
								{ prods.length }
							</p>
						</div>
					</ErrorBoundary>
				</div>
				<div className="col-7">
					{ !prods.length && <h5>Supplier not linked to any products!</h5> }
					<ErrorBoundary>
						{ prods.length > 0 && (
							<table className="table">
								<thead>
									<tr>
										<th>SN</th>
										<th>Product Name</th>
										<th>Purchase Price</th>
										<th>Selling Price</th>
										<th>Quantity</th>
										<th>Is Service?</th>
									</tr>
								</thead>
								<tbody>
									{
										prods?.map( ( p, i ) =>
										{
											return <tr key={ p.id }>
												<td>{ ++i }</td>
												<td>{ p.productName }</td>
												<td>{ p.purchasePrice }</td>
												<td>{ p.sellingPrice }</td>
												<td>{ p.quantity }</td>
												<td>{ p.isAService ? 'Yes' : "No" }</td>
											</tr>
										} )
									}
								</tbody>
							</table>
						) }
					</ErrorBoundary>
				</div>
			</div>

		</>
	);
};

export default SupplierDetail;
