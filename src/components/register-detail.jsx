import { cedisLocale } from "../helpers/utilities";
import { Tag } from "antd";
import { useEffect, useState } from "react";
import { fetchData } from "../helpers/api";
import { ErrorBoundary } from "./error-boundary";

const RegisterDetail = ( { data } ) =>
{
	const [ register, setRegister ] = useState( {} )
	const fetchRegister = ( id ) =>
	{
		fetchData( `registers/${ id }` ).then(
			res =>
			{
				res.status === 200 && (
					setRegister( res.data.data )
				)
			}
		)
	}

	useEffect( () =>
	{
		fetchRegister( data.id )
	}, [ data ] )

	return (
		<>
			<div className="row">
				<div className="col-12">
					<ErrorBoundary>
						<h5>Register
							<Tag className="ms-2" color={ `${ register.isClosed ? 'geekblue' : 'red' }` }>
								{ register.isClosed ? 'CLOSED' : 'OPEN' }
							</Tag>
						</h5>
						<table className="table">
							<tbody>
								<tr>
									<td>Sequence #</td>
									<td>{ register.sequence }</td>
								</tr>
								<tr>
									<td>Open Time</td>
									<td>{ new Date( register.openTime ).toUTCString() }</td>
								</tr>
								<tr>
									<td>Close Time</td>
									<td>{ register.closeTime ? new Date( register.closeTime ).toUTCString() : '-' }</td>
								</tr>
								<tr>
									<td>Opening Float</td>
									<td>{ cedisLocale.format( register.openingFloat ) }</td>
								</tr>
								<tr>
									<td>User</td>
									<td>{ register?.user?.username }</td>
								</tr>
								<tr>
									<td>Opening Note</td>
									<td>{ register.openingNote }</td>
								</tr>
								<tr>
									<td>Closing Note</td>
									<td>{ register.closingNote }</td>
								</tr>
							</tbody>
						</table>
						<table className="table">
							<thead>
								<tr>
									<th>Type</th>
									<th>Expected</th>
									<th>Counted</th>
									<th>Difference</th>
								</tr>
							</thead>
							<ErrorBoundary>
								<tbody>
									{
										register?.payments?.map( p =>
										{
											return <tr key={ p.id }>
												<td>{ p.paymentType }</td>
												<td>{ p.expected }</td>
												<td>{ p.counted }</td>
												<td>{ p.difference }</td>
											</tr>
										} )
									}
								</tbody>
							</ErrorBoundary>
						</table>
					</ErrorBoundary>
				</div>
			</div>

		</>
	);
};

export default RegisterDetail;
