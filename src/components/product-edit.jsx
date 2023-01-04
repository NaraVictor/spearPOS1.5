import { useState, useEffect } from "react";
import { fetchData, updateData } from "../helpers/api";
import { Button, Input, Select, Switch } from "antd";
import { extractInputData, openNotification } from "./../helpers/utilities";
import _ from 'lodash'
import useScanDetection from 'use-scan-detection'
import validator from 'validator'


const ProductEdit = ( { prod, onReload } ) => {
	const [ categories, setCategories ] = useState( [] );
	const [ suppliers, setSuppliers ] = useState( [] );
	const [ record, setRecord ] = useState( {} );
	const [ busy, setBusy ] = useState( false );
	const [ catValue, setValue ] = useState( {
		code: "",
		category: "",
		supplier: "",
	} );
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ barcodeMsg, setBarCodeMsg ] = useState( "barcode active" )

	// variables
	const { Option } = Select;
	const { TextArea } = Input;

	// handlers
	const assignValues = () => {
		setRecord( {
			id: prod.id,
			productName: prod.productName,
			purchasePrice: prod.purchasePrice,
			sellingPrice: prod.sellingPrice,
			quantity: prod.quantity,
			minQty: prod.minQty,
			maxQty: prod.maxQty,
			restockQty: prod.restockQty,
			categoryId: prod.categoryId,
			supplierId: prod.supplierId,
			location: prod.location,
			expiryDate: prod.expiryDate,
			description: prod.description,
			isAService: prod.isAService,
		} );
		setValue( {
			code: prod?.code,
			category: prod.categoryId,
			supplier: prod?.supplierId,
		} );
	};

	const handleRecordChange = ( e ) => {
		const { name, value } = e.target;
		setRecord( {
			...record,
			[ name ]: value,
		} );
	};

	const changeSelect = ( value, name ) => {
		setValue( {
			...catValue,
			[ name ]: value,
		} );
	};

	// barcode scanner detection
	useScanDetection( {
		onComplete: code => {
			changeSelect( code, "code" )
			setBarCodeMsg( "barcode updated" )
			// console.log( 'code ', code );
		},
		minLength: 8, // EAN8 / standard for retail POS is EAN13
	} );

	const fetchSuppliers = () => {
		fetchData( `suppliers` ).then( ( res ) => {
			setSuppliers( () => res.data.data );
		} );
	};

	useEffect( () => {
		fetchData( "categories?type=product" )
			.then( ( res ) => {
				if ( res.status === 200 ) {
					setCategories( () => res.data.data );
				}
			} )
			.catch( ( ex ) => console.log( ex ) );
		assignValues();
		// fetchSuppliers();
	}, [ prod ] );

	const updateProduct = ( e ) => {
		const data = extractInputData( e );
		setBusy( true );


		// validate barcode
		if ( !_.isNumber( parseInt( catValue.code ) ) ) {
			setStatus( {
				err: true,
				errMsg: "Invalid Barcode. Must be an EAN (European Article Number) number",
			} );
			setBusy( false )
			return
		}
		// if ( !validator.isEmpty( catValue.code ) && !validator.isEAN( catValue.code ) ) {
		// 	setStatus( {
		// 		err: true,
		// 		errMsg: "Invalid Barcode. Must be an EAN (European Article Number) number",
		// 	} );
		// 	setBusy( false )
		// 	return
		// }

		if ( catValue.category === undefined || null ) {
			setBusy( false );
			openNotification( "Error", "product category must be specified", 'error' )
			return
		}

		if (
			( record.productName ||
				record.purchasePrice ||
				record.sellingPrice ||
				record.quantity ||
				record.minQty ||
				record.maxQty ) === "" ||
			null
		) {
			setBusy( false );
			openNotification( "Error", "a required field is blank [product name, purchase, selling price, and quantities]" )
			return
		}

		let finalObj = {
			...data,
			isAService: record.isAService,
			categoryId: catValue.category,
			supplierId: catValue.supplier,
			code: _.trim( catValue.code ),
			id: record.id,
		}

		// re-assign the product quantity to itself... 
		if ( record.isAService ) {
			finalObj.quantity = prod.quantity
		}


		setBusy( false );

		updateData( "products", finalObj )
			.then( ( res ) => {
				if ( res.status === 200 ) {
					setStatus( {
						success: true,
						successMsg: "Product successfully updated",
					} );
					onReload();
					setTimeout( () => {
						setStatus( {
							success: false,
						} );
					}, 10000 );
				} else {
					setStatus( {
						err: true,
						errMsg: res.response.data.message,
					} );

				}
			} )
			.catch( ( ex ) => {
				setStatus( {
					err: true,
					errMsg: "Sorry, an error occurred",
				} );
				onReload();
			} )
			.finally( () => {
				setBusy( false );
				// setTimeout( () =>
				// {
				// 	setStatus( {
				// 		err: false,
				// 		success: false,
				// 	} );
				// }, 10000 );
			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ ( e ) => updateProduct( e ) }>
				<div className="row align-items-center mb-3">
					<div className="col-8">
						<label htmlFor="location">Is this a service?</label>
						<Switch checked={ record.isAService } onChange={ () =>
							setRecord( {
								...record,
								isAService: !record.isAService,
							} )
						} className="ms-2" />
						<strong className="ms-2">{ record.isAService ? " Yes" : " No" }</strong>
					</div>
					{
						catValue.code &&
						<div className="col-4 p-2 text-center bg-success text-white rounded">
							{ barcodeMsg }
						</div>
					}
				</div>
				<div className="row">
					<div className="col-12">
						<label htmlFor="productName">Product Name *</label>
						<Input
							type="text"
							// autoFocus
							required
							name="productName"
							placeholder="name of product"
							value={ record.productName }
							onChange={ handleRecordChange }
							className="form-control"
						/>
					</div>
				</div>
				<div className="row my-3">
					<div className="col-md-6">
						<label htmlFor="purchasePrice">Purchase Price *</label>
						<Input
							type="number"
							step="0.01"
							min="0"
							required
							name="purchasePrice"
							value={ record.purchasePrice }
							onChange={ handleRecordChange }
							className="form-control"
							placeholder="cost price"
						/>
					</div>
					<div className="col-md-6">
						<label htmlFor="sellingPrice">Selling Price *</label>
						<Input
							type="number"
							step="0.01"
							min="0"
							required
							name="sellingPrice"
							value={ record.sellingPrice }
							onChange={ handleRecordChange }
							className="form-control"
							placeholder="Selling price"
						/>
					</div>
				</div>
				{
					!record.isAService && (

						<>
							<div className="row my-3">
								<div className="col-md-6 col-12">
									<label htmlFor="quantity">Available Quantity</label>
									<Input
										type="number"
										min="0"
										name="quantity"
										value={ record.quantity }
										disabled={ !record.isAService }
										className="form-control"
										placeholder="Available quantity"
									/>
								</div>
								<div className="col-md-6 col-12">
									<label htmlFor="minQty">Restock Point *</label>
									<Input
										type="number"
										min="0"
										name="minQty"
										required={ !record.isAService }
										value={ record.minQty }
										onChange={ handleRecordChange }
										className="form-control"
										placeholder="Minimum quantity"
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6 col-12">
									<label htmlFor="maxQty">Maximum Quantity *</label>
									<Input
										type="number"
										min="1"
										name="maxQty"
										required={ !record.isAService }
										value={ record.maxQty }
										onChange={ handleRecordChange }
										className="form-control"
										placeholder="Maximum quantity"
									/>
								</div>
								<div className="col-md-6 col-12">
									<label htmlFor="restockQty">Restock Quantity *</label>
									<Input
										type="number"
										min="1"
										required={ !record.isAService }
										name="restockQty"
										value={ record.restockQty }
										onChange={ handleRecordChange }
										className="form-control"
										placeholder="Restock Quantity"
									/>
								</div>
							</div>
						</>
					)
				}
				<div className="row my-3">
					<div className="col-md-6 col-12">
						<label htmlFor="categories">Category *</label>
						<Select
							required
							name="categoryId"
							className="custom-select form-control"
							value={ catValue.category }
							onChange={ ( value ) => changeSelect( value, 'category' ) }>
							{ categories.length > 0 &&
								categories.map( ( cat ) => (
									<Option value={ cat.id } key={ cat.id }>{ cat.name }</Option>
								) ) }
						</Select>
					</div>
					<div className="col-md-6 col-12">
						<label htmlFor="suppliers">Supplier</label>
						<Select
							name="supplierId"
							className="custom-select form-control"
							// disabled
							value={ catValue.supplier }
							onChange={ ( value ) => changeSelect( value, 'supplier' ) }>
							{ suppliers.length > 0 &&
								suppliers.map( ( sup ) => (
									<Option value={ sup.id } key={ sup.id }>{ sup.supplierName }</Option>
								) ) }
						</Select>
					</div>
				</div>
				<div className="row my-3">
					<div className="col-md-6 col-12">
						<label htmlFor="expiryDate">Expiry Date</label>
						<Input
							type="date"
							id="expiryDate"
							className="form-control"
							value={ record.expiryDate }
							name="expiryDate"
							placeholder="Product expiry date"
							onChange={ handleRecordChange }
						/>
					</div>
					<div className="col-md-6 col-12">
						<label htmlFor="location">Location</label>
						<Input
							type="text"
							name="location"
							value={ record.location }
							onChange={ handleRecordChange }
							className="form-control"
							placeholder="Product Location"
						/>
					</div>
					{/* <div className="col-md-6 col-12">
						<label htmlFor="code">Barcode</label>
						<Input
							type="text"
							name="code"
							value={ catValue.code }
							onChange={ e => changeSelect( e.target.value, "code" ) }
							className="form-control"
							placeholder="Product code"
						/>
					</div> */}
				</div>

				<div className="row mb-3">
					{/* <div className="mb-3 col-12">
						<label htmlFor="location">Location</label>
						<Input
							type="text"
							name="location"
							value={ record.location }
							onChange={ handleRecordChange }
							className="form-control"
							placeholder="Product Location"
						/>
					</div> */}
					<div className="col-12">
						<label htmlFor="description">Product Description/Note</label>
						<TextArea
							name="description"
							value={ record.description }
							onChange={ handleRecordChange }
							className="form-control"
							placeholder="short comment"></TextArea>
					</div>
				</div>
				{ status.err && (
					<p className="text-white bg-danger my-2 p-2 rounded">
						{ !_.isArray( status.errMsg ) && status.errMsg }
						{ _.isArray( status.errMsg ) &&
							<ol>
								{ status.errMsg.map( e => {
									return <li key={ e.message }>{ e.message }</li>
								} ) }
							</ol>
						}
					</p>
				) }
				{ status.success && (
					<p className="text-white bg-success my-2 p-2 rounded">
						{ status.successMsg }
					</p>
				) }

				<button id="submitter" hidden type="submit"></button>
			</form>
			<Button
				type="primary"
				loading={ busy ? true : false }
				onClick={ () => {
					document.getElementById( "submitter" ).click();
				} }>
				{ busy ? "updating..." : "Update Product" }
			</Button>
		</div>
	);
};

export default ProductEdit;
