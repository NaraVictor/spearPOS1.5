import { Bar } from "react-chartjs-2";
import { categorySalesChartData } from "../../../../../helpers/charts-data";
import { useState, useEffect } from "react";
import { fetchData } from "../../../../../helpers/api";
import { Spin } from "antd";

const CategorySalesChart = ( props ) =>
{
	const [ data, setData ] = useState( [] );

	const fetch = () =>
	{
		fetchData( "audits/charts?chart=sales" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setData( res.data.data );
			}
		} );
	};

	useEffect( () =>
	{
		fetch();
	}, [] );

	return (
		<>
			{ data.length === 0 ? (
				<>
					<Spin spinning /> loading...
				</>
			) : (
				<Bar { ...categorySalesChartData( data ) } />
			) }
		</>
	);
};

export default CategorySalesChart;
