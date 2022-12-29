import
{
	Divider,
	Space,
	Button,
	Typography,
	Select,
	Table,
	Input,
	Modal,
} from "antd";
import { useState, useEffect } from "react";
import { cedisLocale, daysToExpiry } from "../../../../helpers/utilities";
import { ReloadOutlined, AlertFilled, FilterOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductDetail from "./../../../../components/product-detail";
import ExportToExcelButton from "./../../../../components/export-to-excel-btn";

const FilteredProducts = ( { dataSource, dataSize } ) =>
{
	// state
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );
	const [ pagination, setPagination ] = useState( {
		current: 1,
		pageSize: 10,
	} );
	const [ stock, setStock ] = useState( 0 );

	// variables
	const { Text } = Typography;
	const { Search } = Input;
	const { Option } = Select;

	const showModal = ( title, content, width ) =>
	{
		setModal( {
			content,
			title,
			isVisible: true,
			width,
		} );
	};

	const handleCancel = () =>
	{
		setModal( {
			...modal,
			isVisible: false,
		} );
	};
	// handlers
	const handleResetFilters = () =>
	{
		setFilteredData( dataSource );
	};

	const handleLowStockFilter = () =>
	{
		setFilteredData( dataSource.filter( ( p ) => p.minQty >= p.quantity ) );
	};

	const handleExpiring = () =>
	{
		setFilteredData( dataSource.filter( ( p ) => daysToExpiry( p.expiryDate ) <= 90 ) );
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
		setPagination( {
			...pagination,
			total: dataSize > 80 ? dataSize : 100,
		} );

		setFilteredData( dataSource );
	}, [ dataSource ] );

	useEffect( () =>
	{
		let sum = 0;
		filteredData.map( ( d ) => ( sum += parseInt( d.quantity ) ) );
		setStock( sum );
	}, [ filteredData ] );

	// sales audit table
	const columns = [
		{
			title: "#",
			width: "70px",
			render: ( text, record, index ) => ++index,
		},

		{
			title: "Product",
			dataIndex: "productName",
			sorter: ( a, b ) => a.productName > b.productName,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Category",
			dataIndex: [ "category", "name" ],
			sorter: ( a, b ) => a.category.name.length - b.category.name.length,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Supplier",
			dataIndex: [ "supplier", "supplierName" ],
			sorter: ( a, b ) => a.supplier.supplierName.length - b.supplier.supplierName.length,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Stock",
			sorter: ( a, b ) => a.quantity - b.quantity,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => cedisLocale.format( record.quantity ),
		},
		{
			title: "Unit Price",
			sorter: ( a, b ) => a.sellingPrice - b.sellingPrice,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => cedisLocale.format( record.sellingPrice ),
		},
		{
			title: "Qty Sold",
			render: ( text, record, index ) =>
			{
				let sum = 0;
				record.sales.map( ( r ) => ( sum += r.quantity ) );
				return sum;
			},
		},
		// {
		// 	title: "Purchases (restocks)",
		// 	sorter: ( a, b ) => a.purchases.length - b.purchases.length,
		// 	sortDirections: [ "descend", "ascend" ],
		// 	render: ( t, r, i ) => r.purchases.length,
		// },
		{
			title: "Unique Sales",
			dataIndex: "salesCount",
			sorter: ( a, b ) => a.salesCount - b.salesCount,
			sortDirections: [ "descend", "ascend" ],
		},
	];

	return (
		<>
			<div className="d-flex align-items-center">
				<Modal
					title={ modal.title }
					visible={ modal.isVisible }
					footer={ null }
					onCancel={ handleCancel }
					width={ modal.width && modal.width }>
					{ modal.content }
				</Modal>
				<Typography>
					<Text>Filter by:</Text>
				</Typography>
				<div className="d-flex justify-content-between ">
					<Space className="ms-3">
						<Search
							onChange={ ( e ) =>
								setFilteredData(
									dataSource.filter(
										( d ) =>
											d.quantity === e.target.value ||
											d.sellingPrice === e.target.value ||
											d.salesCount === e.target.value ||
											d.productName
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.category.name
												.toLowerCase()
												.includes( e.target.value.toLowerCase() )
									)
								)
							}
							placeholder="stock, price, #sold, product & category"
							style={ { width: "200px" } }
							title="stock, price, #sold, product & category"
						/>
						<Select
							style={ { width: "150px" } }
							name="bysupplier"
							onChange={ ( s ) =>
								setFilteredData( filteredData.filter( ( d ) => d?.supplier?.supplierName === s ) )
							}
							defaultValue="supplier">
							{ [ ...new Set( filteredData.map( ( d ) => d?.supplier?.supplierName ) ) ].map( ( v ) => (
								<Option value={ v } key={ v }>
									{ v }
								</Option>
							) ) }
						</Select>
						<Select
							style={ { width: "150px" } }
							name="byproductcategory"
							onChange={ ( v ) =>
								setFilteredData(
									filteredData.filter( ( d ) => d.category.name === v )
								)
							}
							defaultValue="product category">
							{ [ ...new Set( filteredData.map( ( d ) => d.category.name ) ) ].map(
								( v ) => (
									<Option value={ v } key={ v }>
										{ v }
									</Option>
								)
							) }
						</Select>
						<Button
							onClick={ handleLowStockFilter }
							type="dashed"
							title="show all products with quantities running below minimum stock levels"
							className="d-flex align-items-center">
							<AlertFilled />
							Low Stocks
						</Button>
						<Button
							onClick={ handleExpiring }
							type="dashed"
							title="show all products with quantities running below minimum stock levels"
							className="d-flex align-items-center">
							<DeleteOutlined />
							Expiring(ed)
						</Button>

						|
						<Button
							onClick={ handleResetFilters }
							type="primary"
							className="d-flex align-items-center rounded">
							<ReloadOutlined />
							Reset filters
						</Button>
						<ExportToExcelButton
							tableId="filtered-products-table"
							fileName="spearPOS products"
							workSheetName="products_sheet"
						/>
						{/* <Button className="d-flex align-items-center">
							<FilePdfFilled />
							to Pdf
						</Button> */}
					</Space>
				</div>
			</div>
			<Divider />

			<Typography className="ms-2 mb-2">
				<Text>
					<Space>
						<strong>{ dataSource.length }</strong> records
						<span className="ms-4">
							- total stock: <strong>{ cedisLocale.format( stock ) }</strong>
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
			<p className="mt-3 mb-0 bg-primary p-2 rounded d-inline text-white">click product to view detail</p>
			<div className="audit-data">
				<Table
					id="filtered-products-table"
					onRow={ ( record, rowIndex ) =>
					{
						return {
							onClick: ( event ) =>
							{
								showModal( record.productName, <ProductDetail prod={ record } /> );
							},
						};
					} }
					columns={ columns }
					dataSource={ filteredData }
					rowKey={ ( record ) => record.id }
					sticky
					pagination={ pagination }
					onChange={ handleTableChange }
				/>
			</div>
		</>
	);
};

export default FilteredProducts;
