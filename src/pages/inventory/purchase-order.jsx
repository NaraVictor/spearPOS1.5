import PageTitle from "./../../components/page-title";
import { cedisLocale } from "../../helpers/utilities";
import { fetchData } from "../../helpers/api";
import { useEffect, useState } from "react";
import { format, isYesterday, isToday } from "date-fns";
import _ from "lodash";
import arraySort from "array-sort";
import
{
	PageHeader,
	Button,
	Table,
	Space,
	Input,
	Select,
	DatePicker,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom'
import { getRole } from "../../helpers/auth";

const PurchaseOrderPage = ( props ) =>
{
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ purchaseOrders, setPurchaseOrders ] = useState( [] );
	const [ selected, setSelected ] = useState( {} );

	// variables
	const { Option } = Select;
	const { RangePicker } = DatePicker;
	const { Search } = Input;
	const dateFormat = "MMM DD, yy";

	// handlers
	const handleResetFilters = () =>
	{
		setFilteredData( purchaseOrders );
	};

	const handleDateFilter = ( data ) =>
	{
		const sdate = format( new Date( data[ 0 ]._d ), "yyyy-MM-dd" );
		const edate = format( new Date( data[ 1 ]._d ), "yyyy-MM-dd" );

		setFilteredData(
			purchaseOrders.filter(
				( d ) =>
					format( new Date( d.createdAt.split( "T" )[ 0 ] ), "yyyy-MM-dd" ) >= sdate &&
					format( new Date( d.createdAt.split( "T" )[ 0 ] ), "yyyy-MM-dd" ) <= edate
			)
		);
	};

	const fetchPurchaseOrders = () =>
	{
		fetchData( "purchase-orders" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setPurchaseOrders( () =>
					arraySort( res.data.data, "createdAt", { reverse: true } )
				);
				setFilteredData( () =>
					arraySort( res.data.data, "createdAt", { reverse: true } )
				);
			}
		} );
	};

	useEffect( () =>
	{
		fetchPurchaseOrders();
	}, [] );

	// table
	const columns = [
		// {
		// 	title: "#",
		// 	sorter: (a, b) => a.receiptNumber > b.receiptNumber,
		// 	sortDirections: ["descend", "ascend"],
		// 	render: (text, record, index) => {
		// 		return ++index;
		// 	},
		// },
		{
			title: "Date",
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
			title: "Items",
			dataIndex: "productCount",
			sorter: ( a, b ) => a.productCount - b.productCount,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Total Qty",
			sorter: ( a, b ) => a.sumQty - b.sumQty,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return cedisLocale.format( record.sumQty );
			},
		},
		{
			title: "Est. Cost",
			sorter: ( a, b ) => a.sumAmt - b.sumAmt,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return cedisLocale.format( record.sumAmt );
			},
		},
		{
			title: "User",
			sorter: ( a, b ) => a.user.username - b.user.username,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return record.user.username;
			},
		},
	];

	return (
		<div className="content-container">
			<PageTitle title="Purchase Orders" />
			<div className="d-flex align-items-center justify-content-between">
				<PageHeader
					ghost={ false }
					title="Purchase Orders"
					className="site-page-header"
					onBack={ () => window.history.go( -1 ) }
					subTitle="product restocking history"></PageHeader>
				{
					getRole() !== 'attendant' && (
						<Button
							type="primary"
							size="large"
							className="d-flex align-items-center ">
							<Link to="/inventory/purchase-orders/new" className="d-flex align-items-center">
								<PlusOutlined />
								New Purchase
							</Link>
						</Button>
					)
				}
			</div>
			<div className="bg-white p-3 my-3 d-flex justify-content-between">
				<Space className="ms-3">
					<Search
						onChange={ ( e ) =>
							setFilteredData(
								purchaseOrders.filter(
									( p ) =>
										p.user.username
											.toLowerCase()
											.includes( e.target.value.toLowerCase() ) ||
										p.productCount
											.toString()
											.includes( e.target.value.toLowerCase() ) ||
										p.sumAmt
											.toString()
											.includes( e.target.value.toLowerCase() ) ||
										p.sumQty.toString().includes( e.target.value.toLowerCase() )
								)
							)
						}
						title="search by user, items count, cost & qty"
						placeholder="search by user, items count, cost & qty"
					/>

					<Select
						style={ { width: "150px" } }
						name="bystaff"
						onChange={ ( v ) =>
							setFilteredData( filteredData.filter( ( d ) => d.user.username === v ) )
						}
						defaultValue="filter by user">
						{ [ ...new Set( filteredData.map( ( d ) => d.user.username ) ) ].map( ( v ) => (
							<Option value={ v } key={ v }>{ v }</Option>
						) ) }
					</Select>
					<RangePicker
						name="date-range"
						format={ dateFormat }
						onChange={ ( e ) => handleDateFilter( e ) }
					/>
				</Space>
				<Button
					onClick={ handleResetFilters }
					type="ghost"
					className="ms-5 d-flex align-items-center">
					<ReloadOutlined />
					Reset filters
				</Button>
			</div>
			<div className="row">
				<div className="col-md-6">
					<div className="bg-white shadow-sm p-3">
						<Table
							rowKey={ ( record ) => record.id }
							onRow={ ( record, rowIndex ) =>
							{
								return {
									onClick: ( event ) =>
									{
										setSelected( record );
									},
								};
							} }
							columns={ columns }
							dataSource={ filteredData }
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="shadow-sm bg-white p-5">
						{ _.isEmpty( selected ) ? (
							<p>No history record selected</p>
						) : (
							<>
								<div className="row">
									<div className="col-12">
										{ format( new Date( selected.createdAt ), "EEEE MMMM d, yyy" ) }
									</div>
								</div>
								<div className="row my-4">
									<div className="col-3">
										<h4 className="mb-0">{ selected.user.username }</h4>
										<small>User</small>
									</div>
									<div className="col-3">
										<h4 className="mb-0">
											{ cedisLocale.format( selected.sumAmt ) }
										</h4>
										<small>Estimated Cost</small>
									</div>
									<div className="col-3">
										<h4 className="mb-0">
											{ cedisLocale.format( selected.productCount ) }
										</h4>
										<small>Number of Products</small>
									</div>
									<div className="col-3">
										<h4 className="mb-0">
											{ cedisLocale.format( selected.sumQty ) }
										</h4>
										<small>Total Quantities</small>
									</div>
								</div>
								<hr />
								<div className="row">
									{ selected.comment && (
										<div className="col-12">
											<small>
												<strong>Comment</strong>
											</small>
											<p className="mb-0">{ selected.comment }</p>
										</div>
									) }
								</div>
								<table className="table table-hover hover-hand mt-4">
									<thead>
										<tr>
											<th>#</th>
											<th>Product</th>
											<th>Original Qty</th>
											<th>Restock Qty</th>
											<th>New Stock Qty</th>
										</tr>
									</thead>
									<tbody>
										{ selected.details.map( ( d, index ) =>
										{
											return (
												<tr key={ index }>
													<td>{ ++index }</td>
													<td>{ d.product.productName }</td>
													<td>{ cedisLocale.format( d.availableQty ) }</td>
													<td>{ cedisLocale.format( d.restockQty ) }</td>
													<td>
														{ cedisLocale.format(
															parseInt( d.availableQty ) + parseInt( d.restockQty )
														) }
													</td>
												</tr>
											);
										} ) }
									</tbody>
								</table>
							</>
						) }
					</div>
				</div>
			</div>
		</div>
	);
};

export { PurchaseOrderPage };
