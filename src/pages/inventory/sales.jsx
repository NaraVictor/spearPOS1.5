import PageTitle from "../../components/page-title";
import { useEffect, useState } from "react";
import { cedisLocale } from "../../helpers/utilities";
import { fetchData, postData } from "../../helpers/api";
import { format, isToday, isYesterday } from "date-fns";
import _ from "lodash";
import { Link } from "react-router-dom";
import {
	PageHeader,
	Button,
	Modal,
	Table,
	Select,
	Input,
	DatePicker,
	Space,
	Divider,
} from "antd";
import {
	DollarCircleFilled,
	PlusOutlined,
	PrinterFilled,
	ReloadOutlined,
	UndoOutlined,
} from "@ant-design/icons";
import SaleReceipt from "./../pos/receipt";
import PaymentHistory from "./payments";
import AddPayment from "./payments-new";
import { getRole } from "../../helpers/auth";
import smalltalk from 'smalltalk'

const SalesPage = ( props ) => {
	const [ sales, setSales ] = useState( [] );
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ selected, setSelected ] = useState( {} );
	const [ msg, setMsg ] = useState( {
		message: "",
		state: ""
	} )
	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );

	// variables
	const { Option } = Select;
	const { RangePicker } = DatePicker;
	const { Search } = Input;
	const dateFormat = "MMM DD, yy";

	const showModal = ( title, content, width ) => {
		setModal( {
			content,
			title,
			isVisible: true,
			width,
		} );
	};

	// handlers
	const handleResetFilters = () => {
		setFilteredData( sales );
	};

	const handleDateFilter = ( data ) => {
		const sdate = format( new Date( data[ 0 ]._d ), "yyyy-MM-dd" );
		const edate = format( new Date( data[ 1 ]._d ), "yyyy-MM-dd" );

		setFilteredData(
			filteredData.filter( ( d ) => d.saleDate >= sdate && d.saleDate <= edate )
		);
	};

	const handleCancel = () => {
		setModal( {
			...modal,
			isVisible: false,
		} );
	};
	const { sumAmt, discount, amountPaid } = selected;

	const fetchSales = () => {
		fetchData( "sales" ).then( ( res ) => {
			if ( res.status === 200 ) {
				setSales( res.data?.data );
				setFilteredData( res.data?.data );
			}
		} );
	};


	const handleReverseSale = () => {

		smalltalk.confirm(
			"Reverse Sale", "Reversing a sale will delete transaction record and return quantities to products. Continue?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok => {
			postData( `sales/reverse/${ selected.id }` ).then( res => {
				if ( res.status === 200 ) {
					setMsg( {
						message: "Sale reversed successfully",
						state: "success"
					} )

					// remove sale from list
					setFilteredData(
						filteredData.filter( f => f.id !== selected.id )
					)

					setSales(
						sales.filter( s => s.id !== selected.id )
					)
					// reset selected sale
					setSelected( {} )
				} else {
					setMsg( {
						message: res.response.data.message,
						state: "error"
					} )
				}

			} ).catch( ex => {
				setMsg( {
					state: "error",
					message: "Sorry, something happened. Operation unsuccessful",
				} );
			} )

			// call reverse api endpoint
			// refetch sales or remove it from list 
		} ).catch( ex => {
			return false
		} )
	}


	useEffect( () => {
		fetchSales();
	}, [] );

	// sales table
	const columns = [
		{
			title: "Receipt #",
			dataIndex: "receiptNumber",
			sorter: ( a, b ) => a.receiptNumber > b.receiptNumber,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Sale Date",
			sorter: ( a, b ) => new Date( a.saleDate ) > new Date( b.saleDate ),
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => {
				return isToday( new Date( record.saleDate ) )
					? "Today"
					: isYesterday( new Date( record.saleDate ) )
						? "Yesterday"
						: format( new Date( record.saleDate ), "EEE MMM d, yy" );
			},
		},

		{
			title: "Total",
			sorter: ( a, b ) => a.sumAmt - b.sumAmt,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => {
				return cedisLocale.format( record.sumAmt );
			},
		},
		{
			title: "User",
			sorter: ( a, b ) => a.user.username - b.user.username,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => {
				return record.user.username;
			},
		},
	];

	return (
		<div className="content-container">
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				onCancel={ handleCancel }
				footer={ null }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<PageTitle title="Sales" />
			<div className="d-flex align-items-center justify-content-between">
				<PageHeader
					ghost={ false }
					title="Sales"
					className="site-page-header"
					onBack={ () => window.history.go( -1 ) }
					subTitle="all recorded sales transactions"></PageHeader>
				<Button
					type="primary"
					size="large"
				>
					<Link to="/pos" className="d-flex align-items-center ">
						<PlusOutlined />
						New Sale
					</Link>

				</Button>
			</div>

			<div className="bg-white p-3 my-3 d-flex justify-content-between">
				<Space className="ms-3">
					<Search
						onChange={ ( e ) =>
							setFilteredData(
								sales.filter(
									( s ) =>
										s.receiptNumber
											.toLowerCase()
											.includes( e.target.value.toLowerCase() ) ||
										s.sumAmt.toString().includes( e.target.value.toLowerCase() )
								)
							)
						}
						title="search by receipt# or total"
						placeholder="search by receipt# & total"
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
				<div className="col-5">
					<div className="bg-white p-3">
						<Table
							rowKey={ ( record ) => record.id }
							onRow={ ( record, rowIndex ) => {
								return {
									onClick: ( event ) => {
										setSelected( record );
									},
								};
							} }
							dataSource={ filteredData }
							columns={ columns }
						/>
					</div>
				</div>
				<div className="col-md-7">
					<div className="shadow-sm bg-white p-5">
						{ _.isEmpty( selected ) ? (
							<div className="row">
								<p>No sale record selected</p>
								<div>
									{
										msg.state === "success" && (
											<div className="my-3 bg-success p-2 text-white rounded">
												{ msg.message }
											</div>
										)
									}
									{
										msg.state === "error" && (
											<div className="my-3 bg-danger p-2 text-white rounded">
												{ msg.message }
											</div>
										)
									}
								</div>
							</div>
						) : (
							<>
								<div className="row">
									{
										msg.state === "error" && (
											<div className="mb-3 bg-danger p-2 text-white rounded">
												{ msg.message }
											</div>
										)
									}

									{ selected.amountPaid < selected.sumAmt && (
										<div className="mb-3">
											<Button
												className="d-flex align-items-center rounded"
												type="primary"
												onClick={ () => {
													showModal(
														"Sale Receipt",
														<SaleReceipt saleId={ selected.id } />,
														"250px"
													);
												} }>
												<PrinterFilled />
												print receipt
											</Button>
											<Divider className="mt-3 mb-0" />
										</div>
									) }
									<div className="mb-3 d-flex">
										{ selected.amountPaid >= selected.sumAmt && (
											<Button
												className="d-flex align-items-center rounded me-3"
												type="primary"
												onClick={ () => {
													showModal(
														"Sale Receipt",
														<SaleReceipt saleId={ selected.id } />,
														"250px"
													);
												} }>
												<PrinterFilled />
												print receipt
											</Button>
										) }
										<Button
											className="d-flex align-items-center me-3"
											type="default"
											onClick={ () => {
												showModal(
													"Payments History",
													<PaymentHistory saleId={ selected.id } />
												);
											} }>
											<DollarCircleFilled />
											Payment History
										</Button>
										{ selected.amountPaid < selected.sumAmt && (
											<Button
												className="d-flex align-items-center"
												type="default"
												onClick={ () => {
													showModal(
														"Add Payment",
														<AddPayment sale={ selected } onReload={ fetchSales } />
													);
												} }>
												<DollarCircleFilled />
												Add Payment
											</Button>
										) }
										{
											getRole() === "admin" && (
												<Button
													className="d-flex align-items-center ms-3"
													type="default"
													onClick={ handleReverseSale }>
													<UndoOutlined />
													REVERSE SALE
												</Button>
											)
										}
									</div>
									<div className="col-4">
										<div>
											<h3 className="mb-0">{ selected.receiptNumber }</h3>
											<small>Receipt #</small>
										</div>
										<div className="mt-3 d-flex">
											<div className="me-5">
												<h6 className="mb-0">{ selected?.paymentMethod }</h6>
												<small>Method</small>
											</div>
											<div>
												<h6 className="mb-0">{ selected.user.username }</h6>
												<small>User</small>
											</div>
										</div>
									</div>
									<div className="col-8">
										<div>
											<h5 className="mb-0">
												{ format(
													new Date( selected.saleDate ),
													"EEEE MMMM dd, yy"
												) }
											</h5>
											<small>Date</small>
										</div>

										<div className="d-flex mt-3">
											<div>
												<h5 className="mb-0">{ cedisLocale.format( sumAmt ) }</h5>
												<small>Total</small>
											</div>
											<div className="mx-5">
												<h5 className="mb-0">{ cedisLocale.format( discount ) }</h5>
												<small>Discount</small>
											</div>
											<div>
												<h5 className="mb-0">
													{ cedisLocale.format( amountPaid ) }
												</h5>
												<small>Amount Paid</small>
											</div>
											<div className="ms-5">
												<h5 className="mb-0">
													{ cedisLocale.format( amountPaid - ( sumAmt - discount ) ) }
												</h5>
												<small>Balance</small>
											</div>
										</div>
									</div>
								</div>
								{ selected.remark && (
									<div className="row my-5">
										<strong>Remark</strong>
										<div className="col-12">{ selected.remark }</div>
									</div>
								) }
								<table className="table table-hover hover-hand mt-4">
									<thead>
										<tr>
											<th>#</th>
											<th>Item</th>
											<th>Quantity</th>
											<th>Unit Price</th>
											<th>Subtotal</th>
										</tr>
									</thead>
									<tbody>
										{ selected.details.map( ( p, index ) => {
											return (
												<tr key={ p.id }>
													<td>{ ++index }</td>
													<td>{ p.product.productName }</td>
													<td>{ p.quantity }</td>
													<td>{ p.unitPrice }</td>
													<td>
														{ cedisLocale.format(
															parseInt( p.quantity ) * parseInt( p.unitPrice )
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

export { SalesPage };
