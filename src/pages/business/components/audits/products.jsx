import { Spin, Tabs } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../helpers/api";
import FilteredProducts from "./filtered-products";
// import ProductSalesCountChart from "./charts/product-sales-count";
const AuditProductComponent = ( props ) =>
{
	const [ data, setData ] = useState( [] );
	const fetchSaleAudits = () =>
	{
		fetchData( "audits/products" ).then( ( res ) =>
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
								<FilteredProducts dataSource={ data } dataSize={ data.length } />
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
							{data.length === 0 ? (
								<>
									<Spin spinning />
									<span className="ms-2">loading...</span>
								</>
							) : (
								<ProductSalesCountChart dataSource={data} />
							)}
						</TabPane> */}
					</Tabs>
				</div>
			</div>
		</>
	);
};

export { AuditProductComponent };
