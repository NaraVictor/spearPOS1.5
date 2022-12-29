import
{
	Divider,
	Space,
	Button,
	Typography,
	DatePicker,
	Table,
	Input,
} from "antd";
import { useState, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { cedisLocale } from "../../../../helpers/utilities";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
// import ExportToExcelButton from "./../../../../components/export-to-excel-btn";

const FilteredPurchases = ( { dataSource, dataSize } ) =>
{
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ pagination, setPagination ] = useState( {
		current: 1,
		pageSize: 10,
	} );
	const [ qty, setQty ] = useState( 0 );
	const [ cost, setCost ] = useState( 0 );
	const [ count, setCount ] = useState( 0 );

	// variables
	const { Text } = Typography;
	const { Search } = Input;
	const { RangePicker } = DatePicker;
	const dateFormat = "MMM DD, yy";

	// handlers
	const handleResetFilters = () =>
	{
		setFilteredData( dataSource );
	};

	const handleDateFilter = ( data ) =>
	{
		try
		{
			const sdate = format( new Date( data[ 0 ]._d ), "yyyy-MM-dd" );
			const edate = format( new Date( data[ 1 ]._d ), "yyyy-MM-dd" );

			setFilteredData(
				filteredData.filter(
					( d ) =>
						d.createdAt.split( "T" )[ 0 ] >= sdate &&
						d.createdAt.split( "T" )[ 0 ] <= edate
				)
			);
		} catch ( ex )
		{
			console.log( ex );
		}
	};

	const handleTableChange = ( e ) =>
	{
		setPagination( {
			...e,
		} );
	};

	useEffect( () =>
	{
		setFilteredData( dataSource );
		setPagination( {
			...pagination,
			total: dataSize > 80 ? dataSize : 100,
		} );
	}, [ dataSource ] );

	useEffect( () =>
	{
		let costSum = 0,
			qtySum = 0,
			countSum = 0;

		filteredData.map( ( d ) => ( costSum += parseFloat( d.sumAmt || 0 ) ) );
		filteredData.map( ( d ) => ( qtySum += parseFloat( d.sumQty || 0 ) ) );
		filteredData.map( ( d ) => ( countSum += parseFloat( d.details.length ) ) );

		setCost( costSum );
		setQty( qtySum );
		setCount( countSum );
	}, [ filteredData ] );

	// purchases audit table
	const columns = [
		{
			title: "Date",
			indexData: "createdAt",
			sorter: ( a, b ) => a.createdAt > b.createdAt,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return isToday( new Date( record.createdAt ) )
					? "Today"
					: isYesterday( new Date( record.createdAt ) )
						? "Yesterday"
						: format( new Date( record.createdAt.split( "T" )[ 0 ] ), "EEE MMM dd, yy" );
			},
		},
		{
			title: "Est. Total Cost",
			sorter: ( a, b ) => a.sumAmt - b.sumAmt,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => cedisLocale.format( record.sumAmt ),
		},

		{
			title: "Total Qty",
			sorter: ( a, b ) => a.sumQty - b.sumQty,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				let sum = 0;
				record.details.map( ( r ) => ( sum += r.restockQty ) );
				return cedisLocale.format( sum );
			},
		},
		{
			title: "Products Count",
			sorter: ( a, b ) => a.details.length - b.details.length,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
				cedisLocale.format( record.details.length ),
		},
		{
			title: "Staff",
			sorter: ( a, b ) => a.user.staff.firstName - b.user.staff.firstName,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, r, index ) =>
				`${ r.user.staff.firstName } ${ r.user.staff.lastName }`,
		},
	];

	const rowExpandedRender = ( source ) =>
	{
		const column = [
			{
				title: "Product",
				sorter: ( a, b ) => a.product.length - b.product.length,
				sortDirections: [ "descend", "ascend" ],
				render: ( t, r, i ) => <strong>{ r.product }</strong>,
			},
			{
				title: "Old Stock",
				dataIndex: "availableQty",
				sorter: ( a, b ) => a.availableQty - b.availableQty,
				sortDirections: [ "descend", "ascend" ],
			},
			{
				title: "New Stock",
				dataIndex: "restockQty",
				sorter: ( a, b ) => a.restockQty - b.restockQty,
				sortDirections: [ "descend", "ascend" ],
			},
			{
				title: "Unit Price",
				dataIndex: "unitPrice",
				sorter: ( a, b ) => a.unitPrice - b.unitPrice,
				sortDirections: [ "descend", "ascend" ],
			},
			{
				title: "Total Stock",
				dataIndex: "totalStock",
				sorter: ( a, b ) => a.totalStock - b.totalStock,
				sortDirections: [ "descend", "ascend" ],
			},
			{
				title: "Est. Total",
				dataIndex: "sumTotal",
				sorter: ( a, b ) => a.sumTotal - b.sumTotal,
				sortDirections: [ "descend", "ascend" ],
			},
		];

		const data = source.details.map( ( d ) =>
		{
			return {
				product: d.product.productName,
				availableQty: d.availableQty,
				restockQty: d.restockQty,
				unitPrice: cedisLocale.format( d.unitPrice ),
				totalStock: cedisLocale.format(
					parseInt( d.availableQty ) + parseInt( d.restockQty )
				),
				sumTotal: cedisLocale.format(
					parseFloat( d.unitPrice ) * parseInt( d.restockQty )
				),
			};
		} );

		return <Table dataSource={ data }
			rowKey={ ( record ) => record.id }
			columns={ column } pagination={ false } />;
	};

	return (
		<>
			<div className="d-flex justify-content-between ">
				<Space className="ms-3">
					<Search
						onChange={ ( e ) =>
							setFilteredData(
								dataSource.filter(
									( d ) =>
										d.sumAmt
											.toString()
											.toLowerCase()
											.includes( e.target.value.toLowerCase() ) ||
										`${ d.user.staff.firstName } ${ d.user.staff.firstName }`
											.toLowerCase()
											.includes( e.target.value.toLowerCase() )
								)
							)
						}
						placeholder="search staff and est. total"
						style={ { width: "300px" } }
					/>

					<RangePicker
						name="date-range"
						format={ dateFormat }
						onChange={ ( e ) => handleDateFilter( e ) }
					/>
				</Space>
				<div className="d-flex">
					<Button
						onClick={ handleResetFilters }
						type="primary"
						className="ms-5 d-flex align-items-center rounded">
						<ReloadOutlined />
						Reset filters
					</Button>
					{/* <ExportToExcelButton
						tableId="filtered-purchases-table"
						fileName="purchases"
						workSheetName="purchases_sheet"
					/> */}
				</div>
			</div>
			<Divider />

			<Typography className="ms-2 mb-2">
				<Text>
					<Space>
						<strong>{ dataSource.length }</strong> records
						<span className="ms-4">
							- sum cost:{ " " }
							<strong className="text-danger">
								{ cedisLocale.format( cost ) }
							</strong>
						</span>
						<span className="ms-4">
							- sum quantity:{ " " }
							<strong className="text-success">
								{ cedisLocale.format( qty ) }
							</strong>
						</span>
						<span className="ms-4">
							- total count:{ " " }
							<strong className="text-success">
								{ cedisLocale.format( count ) }
							</strong>
						</span>
						{ filteredData.length !== dataSource.length && (
							<div className="d-flex align-items-center ms-5">
								<FilterOutlined />
								<strong className="me-2">{ filteredData.length }</strong> filtered
								results
							</div>
						) }
					</Space>
				</Text>
			</Typography>
			<div className="audit-data">
				<Table
					id="filtered-purchases-table"
					columns={ columns }
					bordered
					sticky
					dataSource={ filteredData }
					expandable={ {
						expandedRowRender: ( record ) => rowExpandedRender( record ),
						rowExpandable: ( record ) => record.createdAt,
					} }
					rowKey={ ( record ) => record.id }
					pagination={ pagination }
					onChange={ handleTableChange }
				/>
			</div>
		</>
	);
};

export default FilteredPurchases;
