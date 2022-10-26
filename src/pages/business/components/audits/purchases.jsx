import { Spin, Tabs } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../helpers/api";
import FilteredPurchases from "./filtered-purchases";
const AuditPurchasesComponent = ( props ) =>
{
	const [ data, setData ] = useState( [] );
	const fetchSaleAudits = () =>
	{
		fetchData( "audits/purchases" ).then( ( res ) =>
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
					{/* <ButtonGroup>
						<Button
							type={page === 0 ? "primary" : "default"}
							onClick={() => setPage(0)}
							className="d-flex align-items-center">
							<TableOutlined />
							Table
						</Button>
						<Button
							type={page === 1 ? "primary" : "default"}
							onClick={() => setPage(1)}
							className="d-flex align-items-center">
							<DotChartOutlined />
							Charts
						</Button>
					</ButtonGroup>
					<Divider /> */}
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
								<FilteredPurchases dataSource={ data } dataSize={ data.length } />
							) }
						</TabPane>
						{/* <TabPane
							tab={
								<span className="d-flex align-items-center">
									<DotChartOutlined />
									Charts
								</span>
							}
							key="2">
							Tab 2
						</TabPane> */}
					</Tabs>
				</div>
			</div>
		</>
	);
};

export { AuditPurchasesComponent };
