import { Spin } from "antd";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../helpers/api";
import FilteredDebtors from "./filtered-debtors"

const AuditDebtorsComponent = ( props ) =>
{
	const [ data, setData ] = useState( [] );
	const fetchDebtors = () =>
	{
		fetchData( "sales-debtors" ).then( ( res ) =>
		{
			if ( res.status === 200 ) setData( res.data.data );
		} );
	};

	useEffect( () =>
	{
		fetchDebtors();
	}, [] );
	return (
		<>
			<div className="row">
				<div className="col-12 p-3">
					{ data?.length === 0 ? (
						<>
							<Spin spinning />
							<span className="ms-2">loading...</span>
						</>
					) : (
						<FilteredDebtors dataSource={ data } dataSize={ data.length } />
					) }
				</div>
			</div>
		</>
	);
};

export { AuditDebtorsComponent };
