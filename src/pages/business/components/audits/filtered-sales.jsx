import
{
	Divider,
	Space,
	Button,
	Typography,
	Select,
	DatePicker,
	Table,
	Input,
} from "antd";
import { useState, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { cedisLocale } from "../../../../helpers/utilities";
import
{
	FilterOutlined,
	MoneyCollectOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import ExportToExcelButton from "./../../../../components/export-to-excel-btn";

const FilteredSales = ( { dataSource, dataSize } ) =>
{
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ pagination, setPagination ] = useState( {
		current: 1,
		pageSize: 10,
	} );
	const [ payments, setPayments ] = useState( 0 );
	const [ cost, setCost ] = useState( 0 );

	// variables
	const { Text } = Typography;
	const { Search } = Input;
	const { Option } = Select;
	const { RangePicker } = DatePicker;
	const dateFormat = "MMM DD, yy";

	// handlers
	const handleResetFilters = () =>
	{
		setFilteredData( dataSource );
	};

	// const handlePartialPayments = () =>
	// {
	// 	setFilteredData(
	// 		dataSource.filter( ( d ) => parseFloat( d.amountPaid ) < ( parseFloat( d.sumAmt ) - parseFloat( d.discount ) ) )
	// 	);
	// };

	const handleDiscountSales = () =>
	{
		setFilteredData(
			dataSource.filter( ( d ) => parseFloat( d.discount ) > 0 )
		);
	};

	const handleDateFilter = ( data ) =>
	{
		try
		{
			const sdate = format( new Date( data[ 0 ]._d ), "yyyy-MM-dd" );
			const edate = format( new Date( data[ 1 ]._d ), "yyyy-MM-dd" );

			setFilteredData(
				filteredData.filter( ( d ) => d.saleDate >= sdate && d.saleDate <= edate )
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

	//
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
		let sum = 0;
		let sum2 = 0;
		filteredData.map( ( d ) => ( sum += parseFloat( d.amountPaid || 0 ) ) );
		filteredData.map( ( d ) => ( sum2 += parseFloat( d.sumAmt || 0 ) ) );
		setPayments( sum );
		setCost( sum2 );
	}, [ filteredData ] );

	// sales audit table
	const columns = [
		{
			title: "Receipt #",
			dataIndex: "receiptNumber",
			sorter: ( a, b ) => a.receiptNumber > b.receiptNumber,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Date",
			sorter: ( a, b ) => new Date( a.saleDate ) > new Date( b.saleDate ),
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return isToday( new Date( record.saleDate ) )
					? "Today"
					: isYesterday( new Date( record.saleDate ) )
						? "Yesterday"
						: format( new Date( record.saleDate ), "EEE MMM d, yy" );
			},
		},
		{
			title: "# Sold",
			sorter: ( a, b ) => a.details.length > b.details.length,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => record.details.length,
		},
		{
			title: "Total Cost",
			sorter: ( a, b ) => a.sumAmt > b.sumAmt,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => cedisLocale.format( record.sumAmt ),
		},
		{
			title: "Amt Paid",
			sorter: ( a, b ) => a.amountPaid > b.amountPaid,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => cedisLocale.format( record.amountPaid ),
		},
		{
			title: "Discount",
			sorter: ( a, b ) => a.discount > b.discount,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => cedisLocale.format( record.discount ),
		},
		{
			title: "Balance",
			sorter: ( a, b ) => a.amountPaid > b.amountPaid,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, r, index ) =>
				cedisLocale.format(
					parseFloat( r.amountPaid || 0 ) - parseFloat( r.sumAmt )
				),
		},

		{
			title: "Staff",
			sorter: ( a, b ) =>
				a.user.staff.firstName.length > b.user.staff.firstName.length,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, r, index ) => r.user.staff.firstName,
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
				title: "Category",
				dataIndex: "category",
				sorter: ( a, b ) => a.category - b.category,
				sortDirections: [ "descend", "ascend" ],
			},
			{
				title: "Qty",
				dataIndex: "quantity",
				sorter: ( a, b ) => a.quantity - b.quantity,
				sortDirections: [ "descend", "ascend" ],
			},
			{
				title: "Price",
				dataIndex: "unitPrice",
				sorter: ( a, b ) => a.unitPrice - b.unitPrice,
				sortDirections: [ "descend", "ascend" ],
			},
			{
				title: "Subtotal",
				dataIndex: "subTotal",
				sorter: ( a, b ) => a.subTotal - b.subTotal,
				sortDirections: [ "descend", "ascend" ],
			},
		];

		const data = source.details.map( ( d ) =>
		{
			return {
				product: d.product.productName,
				category: d.product.category.name,
				quantity: d.quantity,
				unitPrice: cedisLocale.format( d.unitPrice ),
				subTotal: cedisLocale.format(
					parseFloat( d.unitPrice ) * parseInt( d.quantity )
				),
			};
		} );

		return <Table dataSource={ data }
			rowKey={ ( record ) => record.id }
			columns={ column } pagination={ false } />;
	};

	return (
		<>
			<div className="d-flex">
				<Typography>
					<Text>Filter by:</Text>
				</Typography>
				<Space className="ms-3">
					<Search
						onChange={ ( e ) =>
							setFilteredData(
								dataSource.filter( ( d ) =>
									d.receiptNumber
										.toLowerCase()
										.includes( e.target.value.toLowerCase() )
								)
							)
						}
						placeholder="receipt #"
					/>

					{/* <Select
							style={{ width: "150px" }}
							name="byproduct"
							onChange={(v) =>
								setFilteredData(
									filteredData.filter(
										(d) => d.details[0].product?.productName === v
									)
								)
							}
							defaultValue="product name">
							{[
								...new Set(
									filteredData.map((d) => d.details[0]?.product?.productName)
								),
							].map((v) => (
								<Option value={v}>{v}</Option>
							))}
						</Select> */}
					<Select
						style={ { width: "150px" } }
						name="byproductcategory"
						onChange={ ( v ) =>
							setFilteredData(
								filteredData?.filter(
									( d ) => d.details[ 0 ].product?.category?.name === v
								)
							)
						}
						defaultValue="product category">
						{ [
							...new Set(
								filteredData.map( ( d ) => d.details[ 0 ]?.product?.category?.name )
							),
						].map( ( v ) => (
							<Option value={ v } key={ v }>{ v }</Option>
						) ) }
					</Select>
					<Select
						style={ { width: "150px" } }
						name="bystaff"
						onChange={ ( v ) =>
							setFilteredData(
								filteredData.filter( ( d ) => d.user.staff.firstName === v )
							)
						}
						defaultValue="staff name">
						{ [
							...new Set( filteredData.map( ( d ) => d.user.staff.firstName ) ),
						].map( ( v ) => (
							<Option value={ v } key={ v }>{ v }</Option>
						) ) }
					</Select>
					<RangePicker
						name="date-range"
						format={ dateFormat }
						onChange={ ( e ) => handleDateFilter( e ) }
					/>
					{/* <Button
						onClick={ handlePartialPayments }
						type="default"
						className="ms-5 d-flex align-items-center">
						<FieldTimeOutlined />
						Partial Payments
					</Button> */}
					<Button
						onClick={ handleDiscountSales }
						type="default"
						className="d-flex align-items-center">
						<MoneyCollectOutlined />
						Discount Sales
					</Button>
					<Button
						onClick={ handleResetFilters }
						type="primary"
						className="d-flex align-items-center rounded">
						<ReloadOutlined />
						Reset filters
					</Button>
					<ExportToExcelButton
						tableId="filtered-sales-table"
						fileName="spearPOS sales"
						workSheetName="sales_sheet"
					/>
				</Space>
			</div>
			<Divider />

			<Typography className="ms-2 mb-2">
				<Text>
					<Space>
						<strong>{ dataSource.length }</strong> records
						<span className="ms-4">
							- total cost:{ " " }
							<strong className="text-danger">
								{ cedisLocale.format( cost ) }
							</strong>
						</span>
						<span className="mx-4">
							- total payments:{ " " }
							<strong className="text-success">
								{ cedisLocale.format( payments ) }
							</strong>
						</span>
						<span>
							- difference: { " " }
							<strong className="text-dark">
								{ cedisLocale.format( parseFloat( cost ) - parseFloat( payments ) ) }
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
					id="filtered-sales-table"
					bordered
					sticky
					loading={ filteredData.length === 0 ? true : false }
					columns={ columns }
					dataSource={ filteredData }
					expandable={ {
						expandedRowRender: ( record ) => rowExpandedRender( record ),
					} }
					rowKey={ ( record ) => record.id }
					pagination={ pagination }
					onChange={ handleTableChange }
				/>
			</div>
		</>
	);
};

export default FilteredSales;
