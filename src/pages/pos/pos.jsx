// TODO: Force user to select customer when amount paid is less than amount due
// selected customer will be entered into debtors collectin/table and payment tracked from there
// same payment tracker as in sales field

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cedisLocale, getRegister, openNotification } from "../../helpers/utilities";
import { fetchData, postData } from "../../helpers/api";
import _ from "lodash";
import { ArrowLeftOutlined, DeleteOutlined, PlusCircleTwoTone, } from "@ant-design/icons";
import { Button, Card, Input, Modal, Select } from "antd";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import SaleReceipt from "./receipt";
import CustomerForm from "../../components/customer"
import smalltalk from 'smalltalk'
import useScanDetection from 'use-scan-detection'

const POS = ( { category, categories, onExit } ) => {
	const [ picked, setPicked ] = useState( [] );
	const [ products, setProducts ] = useState( [] );
	const [ customers, setCustomers ] = useState( [] );
	const [ selectedCategory, setSelectedCategory ] = useState( {} );
	const [ filteredProducts, setFilteredProducts ] = useState( [] );
	const [ paid, setPaid ] = useState( 0 );
	const [ customerId, setSelectCustomer ] = useState( null )
	const [ showMore, setShowMore ] = useState( false );
	const [ discount, setDiscount ] = useState( 0 );
	const [ method, setMethod ] = useState( "" );
	const [ remark, setRemark ] = useState( "" );
	const [ total, setTotal ] = useState( 0 );
	const [ status, setStatus ] = useState( {
		err: false,
		success: false,
		errMsg: "",
		successMsg: "",
		busy: false,
	} );
	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );

	const { TextArea } = Input;

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

	// variables
	const { Option } = Select;
	const { Search } = Input;
	// const balance = cedisLocale.format( ( parseFloat( total || 0 ) - parseFloat( discount || 0 ) ) - parseFloat( paid || 0 ) )
	const balance = ( parseFloat( total || 0 ) - parseFloat( discount || 0 ) ) - parseFloat( paid || 0 )

	// validators
	const addItem = ( item ) => {
		const found = picked.find( ( p ) => p.id === item.id );
		if ( found ) {
			if ( found.count + 1 > found.quantity ) {
				openNotification( 'error', "Available quantity is " + found.quantity, 'error' )
				return;
			}

			const items = picked.filter( ( p ) => p.id !== found.id && p );
			found.count++;
			setPicked( ( prevItems ) => [ ...items, found ] );
		} else {
			setPicked( ( prevPicks ) => [ ...prevPicks, { ...item, count: 1 } ] );
			setStatus( {
				success: false,
			} );
		}
	};

	const updateQty = ( item, value ) => {
		if ( value > item.quantity ) {
			openNotification( 'error', "Available quantity is " + item.quantity, 'error' )
			return;
		}

		// if (!parseInt(value)) return;

		// if (value >= 1) {
		const items = picked.filter( ( p ) => p.id !== item.id );
		item.count = value;
		setPicked( () => [ ...items, item ] );
		// return;
		// }
	};

	const validateQty = ( item ) => {
		const updatedItem = picked.filter( ( p ) => p.id === item.id );
		const ip = updatedItem[ 0 ].count;

		// ensure that field isn't blank or zero
		if ( ip === "" || ip < 1 ) {
			const items = picked.filter( ( p ) => p.id !== item.id );
			item.count = 1;
			setPicked( () => [ ...items, item ] );
		}
		// setPicked(() => [...items, item]);
	};

	// handlers
	const deletePicked = ( item ) => {
		const newPicked = picked.filter( ( p ) => p.id !== item.id && p );
		setPicked( () => newPicked );
	};

	const fetchCustomers = () => {
		fetchData( 'customers' ).then( cus => {
			setCustomers( cus.data.data )
		} )
	}

	const handleSelect = ( selectedCus ) => {
		setSelectCustomer( selectedCus );
	};

	const fetchProducts = ( categoryId ) => {
		fetchData( `products` ).then( ( res ) => {
			const saleProds = res.data?.data?.filter( ( p ) => p.quantity > 0 );
			// (daysToExpiry( p.expiryDate ) > 0 || null) tried hiding expired prods from sales but logi error
			setProducts( saleProds );
			setFilteredProducts( saleProds.filter( p => p.categoryId === categoryId ) );
		} );
	};

	// barcode scanner detection
	useScanDetection( {
		onComplete: code => {
			// find product by code
			const product = products.filter( p => p?.code === code )
			product && addItem( product ) //add when product is found
		},
		minLength: 8, // EAN8 / standard for retail POS is EAN13
	} );


	const checkOut = () => {
		setStatus( {
			// ...status,
			err: false,
			success: false,
		} );

		// ensure debtors are entered
		if ( balance > 0 && !customerId ) {
			setStatus( {
				// ...status,
				err: true,
				errMsg: "A customer must be selected when there is a remaining balance",
			} );
			return;
		}

		// validate items selected
		if ( picked.length === 0 ) {
			setStatus( {
				// ...status,
				err: true,
				errMsg: "No item selected",
			} );
			return;
		}

		// validate amount paid
		if ( paid < 0.1 ) {
			setStatus( {
				// ...status,
				err: true,
				errMsg: "Amount paid is invalid",
			} );
			return;
		}

		// validate payment method
		if ( _.isEmpty( method ) ) {
			setStatus( {
				// ...status,
				err: true,
				errMsg: "Select a payment method",
			} );
			return;
		}

		smalltalk.confirm(
			"Checkout", "Proceed to checking out ?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( go => {


			setStatus( {
				// ...status,
				busy: true,
			} );

			// in the absence of anything, send data
			postData( "sales", {
				picked,
				sumAmt: total,
				paymentMethod: method,
				amountPaid: paid,
				discount: discount,
				remark,
				registerId: getRegister().id,
				customerId
			} )
				.then( ( res ) => {
					if ( res.status === 200 ) {
						reset();
						setStatus( {
							// ...status,
							success: true,
							successMsg: "Sale successfully committed!",
						} );
						openNotification( 'success', 'checkout successful', 'success' )
						showModal(
							"Receipt",
							<SaleReceipt saleId={ res.data.data.id } />,
							"250px"
						);
					} else {
						openNotification( 'error', res.response.data.message, 'error' )
						setStatus( {
							...status,
							err: true,
							errMsg: res.response.data.message,
						} );
					}
				} )
				.catch( ( ex ) =>
					setStatus( {
						...status,
						err: true,
						errMsg: "There was an error. Please try again",
					} )
				)
				.finally( () => {
					setStatus( {
						...status,
						busy: false,
					} );

					setTimeout( () => {
						setStatus( {
							success: false,
						} );
					}, 1000 );
				} );
		} ).catch( ex => {
			return false
		} )

	}

	const reset = () => {
		setPicked( [] );
		setTotal( 0 );
		setDiscount( 0 );
		setPaid( 0 );
		setRemark( "" );
		setStatus( {
			err: false,
			success: false,
			errMsg: "",
			successMsg: "",
			busy: false,
		} );
	};

	useEffect( () => {
		fetchCustomers()
		setSelectedCategory( category );
		fetchProducts( category.id );
		let sum = 0;
		picked.map(
			( prod ) => ( sum += parseInt( prod.count ) * parseFloat( prod.sellingPrice ) )
		);
		setTotal( () => sum );
	}, [ picked ] );

	return (
		<div className="sale-box">
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				footer={ null }
				onCancel={ handleCancel }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>

			<div className="row">
				<div className="col-md-7">
					<div className="mb-3">
						<Splide
							options={ {
								type: "loop",
								autoplay: true,
								pauseOnHover: true,
								resetProgress: false,
								drag: true,
								keyboard: true,
								interval: 3000,
								height: 50,
								perPage: 4,
								pagination: false,
								rewind: true,
								width: 600,
							} }
							hasSliderWrapper>
							{ categories
								.filter( ( c ) => c.products.length > 0 )
								.map( ( c ) => {
									return (
										<SplideSlide className="" key={ c.id }>
											<button
												className={ `py-1 px-2 mx-2 ${ c.id === selectedCategory.id &&
													"bg-secondary text-white"
													}` }
												size="large"
												onClick={ () => {
													setSelectedCategory( c );
													setFilteredProducts(
														products.filter( p => p.categoryId === c.id )
													)
												} }>
												{ c.name }
											</button>
										</SplideSlide>
									);
								} ) }
						</Splide>

					</div>
					<div className="row">
						<div className="col-7">
							<Search
								placeholder="search by product name"
								size="large"
								className="mb-2"
								autoFocus
								onChange={ ( e ) =>
									setFilteredProducts(
										products.filter( ( p ) =>
											p.productName
												.toLowerCase()
												.includes( e.target.value.toLowerCase() )
										)
									)
								}
							/>
							<div className="products">
								<table className="table table-hover">
									<tbody>
										{ filteredProducts.map( ( p ) => {
											return (
												<tr
													key={ p.id }
													onClick={ () => addItem( p ) }
													className="hover-hand">
													<td>
														<h6 className="m-0">{ p.productName }</h6>
														<p className="text-secondary">
															{ p.quantity } items left
														</p>
													</td>
													<td>₵ { cedisLocale.format( parseFloat( p.sellingPrice ) ) }</td>
												</tr>
											);
										} ) }
									</tbody>
								</table>
							</div>
						</div>

						<div className="col-5 g-0">
							<div className="box p-2">
								<table className="table mb-0">
									<tbody>
										{ picked.length === 0 && <p>No item selected</p> }
										{ picked.map( ( item ) => (
											<tr key={ item.id }>
												<td className="w-50">
													{ item.productName }
													<small className="d-block">
														@{ cedisLocale.format( item.sellingPrice ) }
													</small>
												</td>
												<td>
													<input
														type="number"
														name="qty"
														id="qty"
														value={ item.count }
														onChange={ ( e ) => updateQty( item, e.target.value ) }
														onBlur={ ( e ) => validateQty( item ) }
														className="form-control"
													/>
												</td>
												<td
													className="delete-item"
													onClick={ () => deletePicked( item ) }>
													<DeleteOutlined className="text-danger" />
												</td>
											</tr>
										) ) }
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-5">
					<p>{ format( new Date(), "EEEE MMMM dd, YYY" ) }</p>

					<Card
						className={
							balance > 0 ? "bg-danger" :
								balance < 0 ? "bg-secondary" : "bg-success"
						}
						actions={ [
							<div className="d-flex justify-content-between px-4">
								<h5 key="balance" className="text-left">
									Total Due: ₵ { cedisLocale.format( total ) }
								</h5>
								<h6>{ picked.length } items</h6>
							</div>,
						] }>
						<div className="text-white">
							<p
								className="m-0"
								style={ {
									fontSize: "4em",
									fontWeight: "bolder",
								} }>
								₵{ " " }
								{ cedisLocale.format( balance ) }
							</p>
							<p className="m-0">
								{ balance > 0 && "Balance remaining" }
								{ balance === 0 && "Balanced 😊" }
								{ balance < 0 && "Pay customer above balance" }
							</p>
						</div>
					</Card>

					<div className="row my-3">
						<div className="col-6">
							<label htmlFor="amountPaid">
								<strong>Amount Paid:</strong>
							</label>
							<Input
								type="number"
								className="d-block"
								size="large"
								step="0.01"
								name="paid"
								value={ paid }
								onChange={ ( e ) => setPaid( () => e.target.value ) }
								placeholder="amt paid (ghs)"
								id="amountPaid"
							/>
						</div>
						<div className="col-6">
							<label htmlFor="paymentMethod">
								<strong>Method:</strong>
							</label>
							<Select
								className="d-block"
								name="paymentMethod"
								size="large"
								id="paymentMethod"
								value={ method }
								required
								onChange={ ( v ) => setMethod( v ) }>
								<Option defaultValue value="" key={ 1 }>
									select a method
								</Option>
								<Option value="Cash" key={ 2 }>Cash</Option>
								<Option value="Card" key={ 3 }>Card</Option>
								<Option value="Bank" key={ 4 }>Bank</Option>
								<Option value="MoMo" key={ 5 }>MoMo</Option>
								<Option value="Other" key={ 6 }>Other</Option>
							</Select>
						</div>

						<div className="col-12 mt-3">
							<label htmlFor="customerId" className="d-flex justify-content-between align-items-center">
								<strong>Customer:</strong>
								<Button type="link" onClick={ () => {
									showModal( "New Customer", <CustomerForm onReload={ fetchCustomers } /> )
								} }>
									<strong className="align-items-center d-flex">
										add customer
										<PlusCircleTwoTone className="ms-2" />
									</strong>
								</Button>
							</label>
							<Select
								className="d-block"
								name="customerId"
								size="large"
								id="customerId"
								value={ customerId }
								onChange={ ( v ) => handleSelect( v ) }>
								<Option defaultValue value="">
									select a customer
								</Option>
								{
									customers?.map( c =>
										<Option value={ c.id } key={ c.id }>{ `${ c.name } (${ c.category })` }</Option>
									)
								}
							</Select>
						</div>


					</div>
					<Button type="link" className="p-0" onClick={ ( () => setShowMore( !showMore ) ) }>
						<strong>
							{ showMore ? 'less <<' : 'more >>' }
						</strong>
					</Button>
					<div className={ `${ showMore ? 'd-block' : 'd-none' }` }>
						<div className="col-12 mt-1">
							<label htmlFor="discount">
								<strong>Discount:</strong>
							</label>
							<Input
								type="number"
								className="d-block"
								step="0.01"
								size="large"
								min="0"
								name="discount"
								value={ discount }
								onChange={ ( e ) => setDiscount( () => e.target.value ) }
								onBlur={ () => setDiscount( discount || 0 ) }
								placeholder="discount given"
								id="discount"
							/>
						</div>
						<div className="col-12 my-3">
							<label htmlFor="remark">
								<strong>Remark:</strong>
							</label>
							<TextArea
								type="number"
								className="d-block"
								step="0.01"
								size="large"
								name="remark"
								value={ remark }
								onChange={ ( e ) => setRemark( () => e.target.value ) }
								placeholder="any comment/remark"
								id="remark"
							/>
						</div>
					</div>
					<Button
						// disabled={ status.busy ? true : false }
						loading={ status.busy }
						className="bg-success w-100"
						style={ {
							height: "50px",
							fontSize: "18px",
							color: 'white',
							fontWeight: "500"
						} }
						onClick={ checkOut }>
						{ status.busy ? "checking out..." : "CHECKOUT" }
					</Button>
					{ status.err && (
						<p className="text-white text-center bg-danger my-2 p-2">
							{ status.errMsg }
						</p>
					) }
					{ status.success && (
						<p className="text-white text-center bg-success my-2 p-2">
							{ status.successMsg }
						</p>
					) }

				</div>
			</div>

		</div>
	);
};

export { POS };
