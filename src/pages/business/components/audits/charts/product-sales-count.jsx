import { Bar } from "react-chartjs-2";
import { salesCountChartData } from "../../../../../helpers/charts-data";

const ProductSalesCountChart = ({ dataSource }) => {
	return (
		<>
			<Bar {...salesCountChartData(dataSource)} />
		</>
	);
};

export default ProductSalesCountChart;
