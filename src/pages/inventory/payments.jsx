import { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import { cedisLocale } from "../../helpers/utilities";
import { fetchData } from "../../helpers/api";
import { isYesterday, isToday, format } from "date-fns";

const PaymentHistory = ( { saleId } ) =>
{
	const [ payments, setPayment ] = useState( [] );

	const fetchPayments = () =>
	{
		fetchData( `sales/${ saleId }/payments` ).then(
			( res ) => res.status === 200 && setPayment( res.data.data )
		);
	};
	useEffect( () =>
	{
		fetchPayments();
	}, [] );

	return (
		<>
			{ payments.length === 0 ? (
				<>
					<Spin spinning /> loading...
				</>
			) : (
				<Table
					loading={ payments.length === 0 ? true : false }
					rowKey={ ( record ) => record.id }
					sticky
					columns={ [
						{
							title: "Date",
							dataIndex: "createdAt",
							sorter: ( a, b ) => new Date( a.createdAt ) > new Date( b.createdAt ),
							sortDirections: [ "descend", "ascend" ],
							render: ( text, record, index ) =>
							{
								return isToday( new Date( record.createdAt ) )
									? "Today"
									: isYesterday( new Date( record.createdAt ) )
										? "Yesterday"
										: format( new Date( record.createdAt ), "EEE MMM d, yy" );
							},
						},
						{
							title: "Staff",
							dataIndex: "user",
							sorter: ( a, b ) => a.user.staff.firstName - b.user.staff.firstName,
							sortDirections: [ "descend", "ascend" ],
							render: ( t, r, i ) =>
								`${ r.user.staff.firstName } ${ r.user.staff.lastName }`,
						},
						{
							title: "Amount",
							dataIndex: "amount",
							sorter: ( a, b ) => a.amount - b.amount,
							sortDirections: [ "descend", "ascend" ],
							render: ( text, record, index ) =>
								cedisLocale.format( record.amount ),
						},
					] }
					dataSource={ payments }
				/>
			) }
		</>
	);
};

export default PaymentHistory;
