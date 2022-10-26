import PageTitle from "../../components/page-title";
import { useEffect, useState } from "react";
import { cedisLocale, daysToExpiry, openNotification, } from "../../helpers/utilities";
import { deleteData, fetchData } from "../../helpers/api";

// icons
import ProductForm from "./../../components/product";
import ProductDetail from "../../components/product-detail";
import
{
	PageHeader,
	Button,
	Modal,
	Table,
	Divider,
	Select,
	Space,
	Typography,
	Input,
} from "antd";
import ProductEdit from "./../../components/product-edit";
import
{
	AlertFilled,
	DeleteOutlined,
	EditOutlined,
	FolderOpenTwoTone,
	PlusOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import { getRole } from "../../helpers/auth";
import { format, } from "date-fns";
import smalltalk from 'smalltalk'
const InventoryPage = ( props ) =>
{
	const [ products, setProducts ] = useState( [] );
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );

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

	const { Search } = Input;
	const { Option } = Select;

	const fetchProducts = () =>
	{
		fetchData( "products" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setProducts( () => res.data.data );
				setFilteredData( res.data.data );
			}
		} );
	};

	const deleteProduct = ( id ) =>
	{
		smalltalk.confirm(
			"Delete Product", "Are you sure of deleting this product? Can't be undone!", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `products/${ id }` ).then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					fetchProducts();
					openNotification( "Success", "product deleted", "success" )
					return;
				}

				openNotification( "Error", "request not completed!", "error" )

			} );
		} ).catch( ex =>
		{
			return false
		} )
	};

	// handlers
	const handleResetFilters = () =>
	{
		setFilteredData( products );
	};
	const handleLowStockFilter = () =>
	{
		setFilteredData( products.filter( ( p ) => p.minQty >= p.quantity ) );
	};

	useEffect( () =>
	{
		fetchProducts();
	}, [] );

	//

	const prodsCols = [
		{
			title: "Name",
			width: "200px",
			dataIndex: "productName",
			sorter: ( a, b ) => a.productName.length - b.productName.length,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Stock",
			width: "100px",

			sorter: ( a, b ) => a.quantity > b.quantity,
			sortDirections: [ "descend", "ascend" ],
			render: ( t, r, i ) => cedisLocale.format( r.quantity ),
		},
		{
			title: "Unit Price",
			width: "100px",

			sorter: ( a, b ) => a.sellingPrice > b.sellingPrice,
			sortDirections: [ "descend", "ascend" ],
			render: ( t, r, i ) => cedisLocale.format( r.sellingPrice ),
		},

		{
			title: "Category",
			dataIndex: [ "category", "name" ],
			sorter: ( a, b ) => a.category.name.length - b.category.name.length,
			sortDirections: [ "descend", "ascend" ],
		},
		// {
		// 	title: "Expiry Date",
		// 	sorter: ( a, b ) => a.expiryDate - b.expiryDate,
		// 	sortDirections: [ "descend", "ascend" ],
		// 	render: ( t, r, i ) => daysToExpiry( r.expiryDate )
		// 	// render: ( t, r, i ) => format( new Date( r.expiryDate ), "EEEE MMMM dd, yy" ),
		// },
		{
			title: "Supplier",
			dataIndex: [ "supplier", "supplierName" ],
			sorter: ( a, b ) => a.supplier?.supplierName > b.supplier?.supplierName,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Date Added",
			width: "100px",
			sorter: ( a, b ) => a.createdAt > b.createdAt,
			sortDirections: [ "descend", "ascend" ],
			render: ( t, r, i ) => format( new Date( r.createdAt ), "EE MMM dd, yy" ),
		},
		{
			title: "# Sold",
			width: "80px",

			dataIndex: "salesCount",
			sorter: ( a, b ) => a.salesCount - b.salesCount,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Action",
			render: ( text, record, index ) => (
				<ButtonGroup>
					<Button
						title="view record details"
						className="d-flex align-items-center"
						onClick={ () =>
							showModal( record.productName, <ProductDetail prod={ record } /> )
						}>
						<FolderOpenTwoTone />
					</Button>
					<>
						{ getRole() === ( "admin" || "manager" ) && (
							<Button
								title="edit record"
								className="d-flex align-items-center"
								onClick={ () =>
									showModal(
										`Editing: ${ record.productName }`,
										<ProductEdit prod={ record } onReload={ fetchProducts } />
									)
								}>
								<EditOutlined />
								{/* Edit */ }
							</Button>
						) }
						{
							getRole() === "admin" && <Button
								title="delete record"
								onClick={ () => deleteProduct( record.id ) }>
								<DeleteOutlined className="text-danger" />
							</Button>
						}
					</>
				</ButtonGroup>
			),
		},
	];

	return (
		<div className="bg-white p-md-3 content-container">
			<div className="d-flex align-items-center justify-content-between my-4">
				<PageHeader
					ghost={ false }
					title="Inventory"
					className="site-page-header"
					onBack={ () => window.history.go( -1 ) }
					subTitle="all products and their details"></PageHeader>

				{ getRole() === ( "admin" || "manager" ) && (
					<Button
						type="primary"
						size="large"
						className="d-flex align-items-center "
						onClick={ () =>
							showModal( "Add Product", <ProductForm onReload={ fetchProducts } /> )
						}>
						<PlusOutlined />
						Add Product
					</Button>
				) }
			</div>

			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				footer={ null }
				onCancel={ handleCancel }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<PageTitle title="Inventory" />

			<Divider />
			<div className="d-flex align-items-center">
				<Typography>Filter by:</Typography>
				<div className="d-flex justify-content-between ">
					<Space className="ms-3">
						<Search
							onChange={ ( e ) =>
								setFilteredData(
									products.filter(
										( d ) =>
											d.quantity === e.target.value ||
											d.sellingPrice === e.target.value ||
											d.salesCount === e.target.value ||
											d.minQty === e.target.value ||
											d.productName
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.category.name
												.toLowerCase()
												.includes( e.target.value.toLowerCase() )
									)
								)
							}
							placeholder="search all fields"
							style={ { width: "300px" } }
						/>

						<Select
							style={ { width: "150px" } }
							name="byproduct"
							onChange={ ( v ) =>
								setFilteredData( filteredData.filter( ( d ) => d.productName === v ) )
							}
							defaultValue="product name">
							{ [ ...new Set( filteredData.map( ( d ) => d.productName ) ) ].map( ( v ) => (
								<Option value={ v } key={ v }>{ v }</Option>
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
									<Option value={ v } key={ v }>{ v }</Option>
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
					</Space>

					<Button
						onClick={ handleResetFilters }
						type="default"
						className="ms-5 d-flex align-items-center">
						<ReloadOutlined />
						Reset filters
					</Button>
				</div>
			</div>
			<Divider />
			<div className="row">
				<p>
					<strong className="text-info">{ filteredData.length }</strong> records
				</p>
			</div>
			<div className="my-3">
				<strong className="me-2">Legend:</strong>
				<div className="rounded py-1 px-2 text-white bg-danger d-inline">expired product</div>
				<div className="rounded py-1 px-2 text-white bg-dark d-inline mx-2">product about to expire</div>
				<div className="rounded py-1 px-2 text-dark bg-warning d-inline">low stock</div>
			</div>
			<div className="row mt-3">
				<div className="col-12">
					<Table
						loading={ products.length === 0 ? "false" : "true" }
						rowKey={ ( record ) => record.id }
						bordered
						sticky
						pagination={ { defaultPageSize: 10 } }
						footer={ ( data ) => (
							<Space>
								<strong>{ data.length }</strong> records
							</Space>
						) }
						rowClassName={ ( record, index ) =>
						{
							let classes = ""
							if ( record.minQty >= record.quantity ) classes += " bg-warning "
							if ( daysToExpiry( record.expiryDate ) <= 90 && daysToExpiry( record.expiryDate ) >= 0 ) classes += " bg-dark text-white "
							if ( daysToExpiry( record.expiryDate ) < 0 ) classes += " bg-danger text-white "

							return classes
						}
						}
						columns={ prodsCols }
						dataSource={ filteredData }
					/>
				</div>
			</div>
		</div>
	);
};

export { InventoryPage };
