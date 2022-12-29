import { format, isToday, isYesterday } from "date-fns";
import { useEffect, useState } from "react";
import { fetchData } from "../helpers/api";
import { cedisLocale } from "../helpers/utilities";


const DebtorPayment = ( { saleId } ) =>
{
	const [ data, setData ] = useState( [] )

	const fetchPayments = () =>
	{
		fetchData( `sales/${ saleId }/payments` ).then( res =>
		{
			if ( res.status === 200 )
			{
				setData( res.data.data )
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
						<td><strong>Date</strong></td>
						<td><strong>Amount Paid</strong></td>
						<td><strong>Recording Staff</strong></td>
					</tr>
					{ data?.map( d =>
					{
						return <tr>
							<td>
								{ isToday( new Date( d.createdAt ) )
									? "Today"
									: isYesterday( new Date( d.createdAt ) )
										? "Yesterday"
										: format( new Date( d.createdAt ), "EEE MMM d, yy" ) }
							</td>
							<td>
								{ cedisLocale.format( d.amount ) }
							</td>
							<td>
								{ d.user.staff.firstName + " " + d.user.staff.lastName }
							</td>
						</tr>
					} ) }
				</tbody>

			</table>
		</>
	);
};

export default DebtorPayment;
