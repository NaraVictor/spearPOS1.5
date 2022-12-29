import { format, isToday, isYesterday } from "date-fns";
import { useEffect, useState } from "react";
import { fetchData } from "../helpers/api";
import { cedisLocale } from "../helpers/utilities";


const DebtorSaleLine = ( { saleId } ) =>
{
	const [ data, setData ] = useState( [] )

	const fetchPayments = () =>
	{
		fetchData( `sales/${ saleId }` ).then( res =>
		{
			if ( res.status === 200 )
			{
				setData( res.data.data.details )
				console.log( res.data.data.details );
			}
		} )
	}

	useEffect( () =>
	{
		fetchPayments()
	}, [] )

	return (
		<>
			<table className="table">
				<tbody>
					<tr>
						<td><strong>Product</strong></td>
						<td><strong>Unit Price</strong></td>
						<td><strong>Quantity</strong></td>
						<td><strong>Line Total</strong></td>
					</tr>
					{ data?.map( d =>
					{
						return <tr>
							<td>
								{ d.product.productName }
							</td>
							<td>
								{ cedisLocale.format( d.unitPrice ) }
							</td>
							<td>
								{ d.quantity }
							</td>
							<td>
								{ cedisLocale.format( parseFloat( d.unitPrice ) * parseInt( d.quantity ) ) }
							</td>
						</tr>
					} ) }
				</tbody>

			</table>
		</>
	);
};

export default DebtorSaleLine;
