import PageTitle from "./page-title";
import { useState, useEffect } from "react";
import {
	cedisLocale,
	openNotification,
	populateLowStock,
} from "../helpers/utilities";
import {
	fetchData,
	postData,
} from "../helpers/api";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { Alert, PageHeader, Button, Table, Modal, Input, Tooltip } from "antd";
import {
	AlertFilled,
	AppstoreAddOutlined,
	ArrowRightOutlined,
	DeleteFilled,
	DeleteOutlined,
	FolderOpenFilled,
} from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import ProductDetail from "./product-detail";
import smalltalk from 'smalltalk'
import useScanDetection from 'use-scan-detection'


const PurchaseOrderForm = ( props ) => {
	const { handleSubmit, register, reset } = useForm();
	const [ prods, setProds ] = useState( [] );
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ selected, setSelected ] = useState( [] );
	const { Search } = Input;

	const [ status, setStatus ] = useState( {
		err: false,
		errMsg: "",
		success: false,
		successMsg: "",
	} );
	const [ summary, setSummary ] = useState( {
		sumAmt: 0,
		sumQty: 0,
		productCount: 0,
	} );
	const [ loading, setLoading ] = useState( false );
	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );

	const showModal = ( title, content, width ) => {
		setModal( {
			content,
			title,
			isVisible: true,
			width,
		} );
	};

	const handleCancel = () => {
		setModal( {
			...modal,
			isVisible: false,
		} );
	};

	const fetchProducts = async () => {
		fetchData( "products" ).then( ( res ) => {
			if ( res.status === 200 ) {
				setProds( res.data.data.filter( p => {
					if ( !p?.isAService || _.isUndefined( p.isAService ) )
						return p;
				} ) );

				setFilteredData( res.data.data.filter( p => {
					if ( !p?.isAService || _.isUndefined( p.isAService ) )
						return p;
				} ) );
			}
		} );
	}

	const removeItem = ( prod ) => {
		const newSelected = selected.filter( ( s ) => s.id !== prod.id );
		setSelected( () => newSelected );
		setFilteredData( ( prev ) => [ ...prev, prod ] );
	};

	const addItem = ( prod ) => {
		const newProds = filteredData.filter( ( p ) => p.id !== prod.id );
		setFilteredData( () => newProds );
		setSelected( ( prev ) => [ ...prev, prod ] );
	};

	// const handleLowStockFilter = () => {
	// 	setFilteredData(filteredData.filter((p) => p.minQty >= p.quantity));
	// };

	const addAll = () => {
		setSelected( ( prev ) => [ ...prev, ...filteredData ] );
		setFilteredData( [] );
	};

	const addAllLowStock = () => {
		// removeAllSelected();
		const { lowStocks, remainder } = populateLowStock( filteredData );

		if ( lowStocks.length > 0 )
			// add low stocks to selected items
			setSelected( ( prev ) => [ ...prev, ...lowStocks ] );

		if ( remainder.length > 0 )
			//set filtered data to remaining stocks
			setFilteredData( remainder );
	};


	// barcode scanner detection
	useScanDetection( {
		onComplete: code => {
			const prod = filteredData.find( p => p.code === code )
			prod && addItem( prod )
		},
		minLength: 8, // EAN8 / standard for retail POS is EAN13
	} );


	const removeAllSelected = () => {
		setFilteredData( [ ...prods ] );
		setSelected( [] );
	};

	const isSelected = ( item ) => {
		const found = selected.filter( ( s ) => s.id === item.id );
		return found.length > 0 ? true : false;
	};

	const handleSearch = ( word ) => {
		let results = [];
		// perform search on non-empty inputs only
		if ( !_.isEmpty( word ) ) {
			// use original products list (not mutated)
			prods.map( ( p ) => {
				// look for non-selected products
				if ( !isSelected( p ) ) {
					if (
						p.productName.toLowerCase().includes( word.toLowerCase() ) ||
						p.category.name.toLowerCase().includes( word.toLowerCase() )
					)
						// push non-selected product with matching input value to results
						results.push( p );
				}
			} );

			setFilteredData( results );
			return;
		}

		results = prods.filter( ( p ) => !isSelected( p ) );
		setFilteredData( results );
	};

	const updateQty = ( value, pId ) => {
		value = parseInt( value ) || 0;
		const newSelected = selected.map( ( s ) => {
			// find matching record
			if ( s.id === pId ) {
				// check max stock constraint
				if ( parseInt( s.quantity ) + value > parseInt( s.maxQty ) ) {
					// allow decrement of restock qty that's already above max stock
					if ( value > s.restockQty ) {
						setStatus( {
							err: true,
							errMsg: `Max quantity (${ s.maxQty }) of ${ s.productName } will be exceeded!`,
						} );

						setTimeout( () => {
							setStatus( {
								err: false,
							} );
						}, 8000 );
					}

					// return s;
				}

				s.restockQty = value;
				return s;
			}
			return s;
		} );
		setSelected( newSelected );
	};

	useEffect( () => {
		fetchProducts();
		setSelected( [] );
	}, [] );

	useEffect( () => {
		let sumAmt = 0;
		let sumQty = 0;
		selected.forEach( ( s ) => {
			sumAmt += parseInt( s.restockQty ) * parseFloat( s.purchasePrice );
			sumQty += parseInt( s.restockQty );
		} );
		setSummary( {
			productCount: selected.length || 0,
			sumQty,
			sumAmt,
		} );
	}, [ selected ] );

	const postPurchaseOrder = ( data ) => {
		if ( selected.length === 0 ) {
			setStatus( {
				err: true,
				errMsg: "No products have been selected",
			} );

			setTimeout( () => {
				setStatus( {
					err: false,
				} );
			}, 5000 );
			return;
		}

		smalltalk.confirm(
			"Restock Confirmation", "This action is irreversible. Continue?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( yes => {

			setLoading( true );

			postData( "purchase-orders", {
				...summary,
				comment: data.comment,
				selected,
			} )
				.then( ( res ) => {
					if ( res.status === 200 ) {
						setStatus( {
							success: true,
							successMsg: "Products successfully restocked!",
						} );
						setSummary( {
							productCount: 0,
							sumAmt: 0,
							sumQty: 0,
						} );
						removeAllSelected(); //remove all items selected back to products list
						reset();
						fetchProducts(); // refetch products
						openNotification( 'success', 'purchase order (restocking) successfully completed', 'success' )
					} else {
						openNotification( 'error', res.response.data.message, 'error' )
						setStatus( {
							err: true,
							errMsg: res.response.data.message,
						} )

					}
					// props.onDone(); //trigger props method -> has been causing an error  leading to display of error msgs
				} )
				.catch( ( ex ) => {
					// console.error( 'error' );
					setStatus( {
						err: true,
						errMsg: "An error has occurred. Please try again",
					} )
				}
				)
				.finally( () => {
					setTimeout( () => {
						setStatus( {
							success: false,
							err: false,
						} );
					}, 5000 );
					setLoading( false );
				} );
		}
		).catch( ex => {
			return false
		} );
	};

	return (
		<div className="content-container">
			<PageTitle title="New Purchase" />
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				footer={ null }
				onCancel={ handleCancel }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<div className="d-flex align-items-center justify-content-between">
				<PageHeader
					ghost={ false }
					title="New Purchase"
					className="site-page-header"
					onBack={ () => window.history.go( -1 ) }
					subTitle="input new product(s) restock"></PageHeader>
				<div className="d-flex">
					<Button
						onClick={ addAllLowStock }
						disabled={ filteredData.length < 1 ? true : false }
						type="dashed"
						size="large"
						title="select all products with quantities running below minimum stock levels"
						className="d-flex align-items-center">
						<AlertFilled />
						Select Low Stocks
					</Button>
					<Button
						type="default"
						size="large"
						disabled={ filteredData.length < 1 ? true : false }
						className="d-flex align-items-center"
						onClick={ () => addAll() }>
						<AppstoreAddOutlined />
						Select All
					</Button>
					<Button
						type="default"
						size="large"
						disabled={ selected.length < 1 ? true : false }
						className="d-flex align-items-center "
						onClick={ () => removeAllSelected( [] ) }>
						<DeleteFilled />
						Remove All
					</Button>
				</div>
			</div>
			<div className="mt-3">
				{ status.err && (
					<Alert
						type="error"
						onClose={ () =>
							setStatus( {
								err: false,
							} )
						}
						message={ status.errMsg }
						closable
						showIcon
					/>
				) }
				{ status.success && (
					<Alert type="success" message={ status.successMsg } closable showIcon />
				) }
			</div>

			<div
				className={ `${ summary.productCount > 0 ? "bg-success" : "bg-secondary"
					} text-white p-3 my-3 d-flex justify-content-between` }>
				<div className="mb-0">
					<small>Estimated Total Cost:</small>
					<div className="h4 mb-0">
						{ cedisLocale.format( summary.sumAmt || 0 ) }
					</div>
				</div>
				<div className="mb-0">
					<small>Total Purchase Qty:</small>
					<div className="h4 mb-0">
						{ cedisLocale.format( summary.sumQty || 0 ) }
					</div>
				</div>
				<div className="mb-0">
					<small>Selected Products:</small>
					<div className="h4 mb-0">
						{ cedisLocale.format( summary.productCount ) }
					</div>
				</div>

				<form onSubmit={ handleSubmit( postPurchaseOrder ) } className="d-flex">
					<textarea
						className="form-control me-2"
						placeholder="comment or remark (optional)"
						name="comment"
						id="comment"
						{ ...register( "comment", { required: false } ) }
						cols="55"
						rows="1"></textarea>
					<input type="submit" value="" hidden id="submitter" />
					<Button
						type="default"
						onClick={ () => {
							document.getElementById( "submitter" ).click();
						} }
						loading={ loading ? true : false }
						size="large">
						CONFIRM PURCHASE
					</Button>
				</form>
			</div>

			<div className="row">
				<div className="col-md-6">
					<div className="bg-white shadow-sm p-3">
						<Search
							onChange={ ( e ) => handleSearch( e.target.value ) }
							placeholder={ `search (${ filteredData.length }) products by name or category` }
							className="mb-2"
						// autoFocus
						/>
						<Table
							columns={ [
								{
									title: "#",
									sorter: ( a, b ) => a.index > b.index,
									sortDirections: [ "descend", "ascend" ],
									render: ( text, record, index ) => ++index,
								},
								{
									title: "Product",
									sorter: ( a, b ) => a.productName > b.productName,
									sortDirections: [ "descend", "ascend" ],
									render: ( text, record, index ) => record.productName,
								},
								{
									title: "Category",
									sorter: ( a, b ) => a.category.name > b.category.name,
									sortDirections: [ "descend", "ascend" ],
									render: ( text, record, index ) => record.category.name,
								},
								{
									title: "Available Stock",
									sorter: ( a, b ) => a.quantity > b.quantity,
									sortDirections: [ "descend", "ascend" ],
									render: ( text, record, index ) => record.quantity,
								},

								{
									render: ( text, record, index ) => (
										<ButtonGroup>
											<Tooltip title="view product details">
												<Button
													className="d-flex align-items-center"
													onClick={ () =>
														showModal(
															record.productName,
															<ProductDetail
																prod={ record }
																toggleModal={ showModal }
															/>
														)
													}>
													<FolderOpenFilled />
												</Button>
											</Tooltip>
											<Tooltip title={ `select product (${ record.productName })` }>
												<Button
													className="d-flex align-items-center"
													onClick={ () => addItem( record ) }>
													<ArrowRightOutlined />
													{/* select */ }
												</Button>
											</Tooltip>
										</ButtonGroup>
									),
								},
							] }
							rowKey={ ( record ) => record.id }
							rowClassName={ ( record, index ) =>
								record.minQty >= record.quantity && "bg-warning"
							}
							dataSource={ filteredData }
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="bg-white shadow-sm p-3">
						{ selected.length === 0 ? (
							<p className="mt-3">No product selected</p>
						) : (
							<>
								<Table
									columns={ [
										{
											title: "Product",
											sorter: ( a, b ) => a.productName > b.productName,
											sortDirections: [ "descend", "ascend" ],
											render: ( text, record, index ) => record.productName,
										},
										{
											title: "Available Stock",
											sorter: ( a, b ) => a.quantity > b.quantity,
											sortDirections: [ "descend", "ascend" ],
											render: ( text, record, i ) => record.quantity,
										},
										{
											title: "Purchase Quantity",
											sorter: ( a, b ) => a.restockQty > b.restockQty,
											sortDirections: [ "descend", "ascend" ],
											render: ( text, record, index ) => (
												<Input
													type="number"
													name="restockQty"
													min="0"
													id="restockQty"
													className="form-control w-100"
													value={ record.restockQty }
													onChange={ ( e ) => updateQty( e.target.value, record.id ) }
												/>
											),
										},
										{
											title: "Expected Total Qty",
											sorter: ( a, b ) => a.index > b.index,
											sortDirections: [ "descend", "ascend" ],
											render: ( text, record, index ) =>
												parseInt( record.quantity ) + parseInt( record.restockQty ),
										},
										{
											render: ( text, record, index ) => (
												<Tooltip
													title={ `remove selected product (${ record.productName })` }>
													<Button
														type="text"
														className="text-danger"
														onClick={ () => removeItem( record ) }>
														<DeleteOutlined />
													</Button>
												</Tooltip>
											),
										},
									] }
									rowKey={ ( record ) => record.id }
									dataSource={ selected }
								/>
							</>
						) }
					</div>
				</div>
			</div>
		</div>
	);
};

export default PurchaseOrderForm;
