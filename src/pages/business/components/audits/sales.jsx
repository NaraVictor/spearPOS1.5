import { Spin, Tabs } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import FilteredSales from "./filtered-sales";
import { fetchData } from "../../../../helpers/api";
// import CategorySalesChart from "./charts/category-sales-chart";

const AuditSalesComponent = ( props ) =>
{
	const [ data, setData ] = useState( [] );
	const fetchSaleAudits = () =>
	{
		fetchData( "audits/sales" ).then( ( res ) =>
		{
			if ( res.status === 200 ) setData( res.data.data );
		} );
	};
	const { TabPane } = Tabs;

	useEffect( () =>
	{
		fetchSaleAudits();
	}, [] );
	return (
		<>
			<div className="row">
				<div className="col-12">
					<Tabs defaultActiveKey="1">
						<TabPane
							tab={
								<span className="d-flex align-items-center">
									<TableOutlined />
									Table
								</span>
							}
							key="1">
							{ data.length === 0 ? (
								<>
									<Spin spinning />
									<span className="ms-2">loading...</span>
								</>
							) : (
								<FilteredSales dataSource={ data } dataSize={ data.length } />
							) }
						</TabPane>
						{/* <TabPane
							tab={
								<span className="d-flex align-items-center">
									<DotChartOutlined />
									Chart
								</span>
							}
							key="2">
							<CategorySalesChart />
						</TabPane> */}
					</Tabs>
				</div>
			</div>
		</>
	);
};

export { AuditSalesComponent };
