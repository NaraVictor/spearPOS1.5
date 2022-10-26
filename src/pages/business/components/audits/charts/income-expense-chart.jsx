import { Bar } from "react-chartjs-2";
import { incomeExpenseChartData } from "./../../../../../helpers/charts-data";
import { useState, useEffect } from "react";
import { fetchData } from "../../../../../helpers/api";

const IncomeExpenseChart = ( props ) =>
{
	const [ data, setData ] = useState( {} );

	const fetch = () =>
	{
		fetchData( "dashboard" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setData( {
					income: res.data.data.dailySales,
					expenses: res.data.data.dailyExpenses,
				} );
			}
		} );
	};

	useEffect( () =>
	{
		fetch();
	}, [] );

	return (
		<>
			<Bar { ...incomeExpenseChartData( data ) } />
		</>
	);
};

export default IncomeExpenseChart;
