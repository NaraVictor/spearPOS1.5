import { useState, useEffect } from "react";
import { fetchData, postData } from "../helpers/api";
import { useForm } from "react-hook-form";
import { Spinner1 } from "./spinner";
import { Switch } from "antd";
import _ from 'lodash'

const ProductForm = ( { onReload } ) => {
	const [ categories, setCategories ] = useState( [] );
	const [ suppliers, setSuppliers ] = useState( [] );
	const [ value, setValue ] = useState( {
		category: "",
		supplier: "",
	} );

	const { handleSubmit, register, reset } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );
	const [ isAService, setIsService ] = useState( false );


	const changeValue = ( data, name ) => {
		setValue( {
			...value,
			[ name ]: data,
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
		fetchData( "suppliers" )
			.then( ( res ) => {
				if ( res.status === 200 ) {
					setSuppliers( res.data.data );
				}
			} )
	}, [] );

	const submitProduct = ( data ) => {
		setBusy( true );

		if ( isAService ) {
			data.quantity = 1;
			data.minQty = 0;
			data.maxQty = 0;
			data.restockQty = 0
		}

		postData( "products", {
			...data,
			isAService,
			categoryId: value.category,
			supplierId: value.supplier,
		} )
			.then( ( res ) => {
				if ( res.status === 200 ) {
					setStatus( {
						success: true,
						successMsg: "Product successfully added",
					} );
					reset();
					onReload();
					setTimeout( () => {
						setStatus( {
							err: false,
							success: false,
						} );
					}, 10000 );
				}
				else {
					setStatus( {
						err: true,
						errMsg: res.response.data.message,
					} );
				}

			} )
			.catch( ( ex ) => {

				setStatus( {
					err: true,
					errMsg: "Sorry, something happened. Operation unsuccessful",
				} );
				// reset();
			} )
			.finally( () => {
				setBusy( false );

			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ handleSubmit( submitProduct ) }>
				{ busy && (
					<div className="text-center">
						<Spinner1 />
						<p>please wait...</p>
					</div>
				) }
				{ !busy && (
					<>
						<div className="row">
							<div className="col-12 mb-3">
								<label htmlFor="location">Is this a service?</label>
								<Switch onChange={ () => setIsService( !isAService ) } className="ms-2" />
								<strong className="ms-2">{ isAService ? " Yes" : " No" }</strong>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<label htmlFor="productName">Product Name *</label>
								<input
									type="text"
									autoFocus
									id="productName"
									placeholder="name of product"
									className="form-control"
									{ ...register( "productName", { required: true } ) }
								/>
							</div>
						</div>
						<div className="row my-3">
							<div className="col-md-6">
								<label htmlFor="purchasePrice">Purchase Price *</label>
								<input
									type="number"
									step="0.01"
									min="0"
									id="purchasePrice"
									className="form-control"
									placeholder="cost price"
									{ ...register( "purchasePrice", { required: true } ) }
								/>
							</div>
							<div className="col-md-6">
								<label htmlFor="sellingPrice">Selling Price *</label>
								<input
									type="number"
									step="0.01"
									min="0"
									id="sellingPrice"
									className="form-control"
									placeholder="Selling price"
									{ ...register( "sellingPrice", { required: true } ) }
								/>
							</div>
						</div>
						{
							!isAService && (
								<>
									<div className="row my-3">
										<div className="col-md-6 col-12">
											<label htmlFor="quantity">Available Quantity *</label>
											<input
												type="number"
												min="0"
												id="quantity"
												className="form-control"
												placeholder="Available quantity"
												{ ...register( "quantity", { required: !isAService } ) }
											/>
										</div>
										<div className="col-md-6 col-12">
											<label htmlFor="minQty">Restock Point *</label>
											<input
												type="number"
												min="0"
												id="minQty"
												className="form-control"
												placeholder="Minimum quantity"
												{ ...register( "minQty", { required: !isAService } ) }
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-6 col-12">
											<label htmlFor="maxQty">Maximum Quantity *</label>
											<input
												type="number"
												min="1"
												id="maxQty"
												className="form-control"
												placeholder="Maximum quantity"
												{ ...register( "maxQty", { required: !isAService } ) }
											/>
										</div>
										<div className="col-md-6 col-12">
											<label htmlFor="restockQty">Restock Quantity *</label>
											<input
												type="number"
												min="1"
												id="restockQty"
												className="form-control"
												placeholder="Restock Quantity"
												{ ...register( "restockQty", { required: !isAService } ) }
											/>
										</div>
									</div>

								</>
							)
						}
						<div className="row my-3">
							<div className="col-md-6 col-12">
								<label htmlFor="categories">Category *</label>
								<select
									name="categories"
									required
									id="categories"
									className="custom-select form-control"
									value={ value.category }
									onChange={ ( e ) => changeValue( e.target.value, 'category' ) }>
									<option defaultValue value="">
										select a category
									</option>
									{ categories.length > 0 &&
										categories.map( ( cat ) => (
											<option value={ cat.id }>{ cat.name }</option>
										) ) }
								</select>
							</div>
							<div className="col-md-6 col-12">
								<label htmlFor="suppliers">Supplier</label>
								<select
									name="supplierId"
									className="custom-select form-control"
									value={ value.supplier }
									// disabled
									onChange={ ( e ) => changeValue( e.target.value, 'supplier' ) }>
									{/* <option defaultValue value="">PRO</option> */ }
									{ suppliers.length > 0 &&
										suppliers.map( ( sup ) => (
											<option value={ sup.id }>{ sup.supplierName }</option>
										) ) }
								</select>
							</div>


						</div>

						<div className="row my-3">
							<div className="col-md-6 col-12">
								<label htmlFor="expiryDate">Expiry Date</label>
								<input
									type="date"
									id="expiryDate"
									className="form-control"
									placeholder="Product expiry date"
									{ ...register( "expiryDate" ) }
								/>
							</div>
							<div className="col-md-6 col-12">
								<label htmlFor="location">Location</label>
								<input
									type="text"
									id="location"
									className="form-control"
									placeholder="Product Location"
									{ ...register( "location" ) }
								/>
							</div>
						</div>

						<div className="row mb-3">
							<div className="col-12">
								<label htmlFor="description">Product Description/Note</label>
								<textarea
									id="description"
									className="form-control"
									placeholder="short comment"
									{ ...register( "description" ) }></textarea>
							</div>
						</div>

						<button className="btn btn-primary" type="submit">
							Add Product
						</button>
						{ status.err && (
							<p className="text-white bg-danger my-2 p-2 rounded">
								{ !_.isArray( status.errMsg ) && status.errMsg }
								{ _.isArray( status.errMsg ) &&
									<ol>
										{ status.errMsg.map( e => {
											return <li>{ e.message }</li>
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
					</>
				) }
			</form>
		</div>
	);
};

export default ProductForm;
