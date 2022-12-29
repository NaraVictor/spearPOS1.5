import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Select, Spin, Tag } from "antd";
import _ from "lodash";
import { useState, useEffect, useRef } from "react";
import { fetchData } from "../../helpers/api";
import { cedisLocale } from "./../../helpers/utilities";
import { useReactToPrint } from "react-to-print";

const SaleReceipt = ( { saleId } ) => {
	// variables
	const printArea = useRef();
	const { Option } = Select
	const printSize = localStorage.getItem( 'printerSize' ) || '58' //defaults printer dimension to 58mm when a prev is not found


	// 
	const [ company, setCompany ] = useState( {} );
	const [ sale, setSale ] = useState( {} );
	const [ size, setSize ] = useState( printSize )

	// handlers
	const handlePrint = useReactToPrint( {
		content: () => printArea.current,
		documentTitle: "receipt " + sale.receiptNumber,
		copyStyles: true,
		bodyClass: "sale-receipt"
	} );

	const fetchCompanyRecord = () => {
		fetchData( "company" ).then(
			( res ) => res.status === 200 && setCompany( res.data.data[ 0 ] )
		);
	};

	const fetchSale = () => {
		fetchData( `sales/${ saleId }` ).then(
			( res ) => res.status === 200 && setSale( res.data.data )
		);
	};


	const handleSizeChange = ( size ) => {
		setSize( size )
		localStorage.setItem( 'printerSize', _.toString( size ) )
	}

	useEffect( () => {
		fetchCompanyRecord();
		fetchSale();
	}, [ saleId ] );

	return (
		// size58
		<>

			<div className={ `sale-receipt ${ size === '58' ? ' print-size-58' : ' print-size-80' }` }>
				<div className="receipt-content p-2" ref={ printArea }>
					<div className="header text-center">
						<h6 className="mb-1 receipt-title">{ company?.companyName }</h6>
						<p className="m-0">{ company?.address }</p>
						<p className="m-0  text-center">
							{/* { company.gps && (
							<span className="me-3">
								<strong>gps:</strong> { company.address }
							</span>
						) } */}
							{/* { company?.TIN && (
								<span>
									<strong>TIN:</strong> { company?.TIN }
								</span>
							) } */}
						</p>
						<p className="mt-1">
							{ company?.primaryContact }
							{ company?.secondaryContact && " / " + company.secondaryContact }
						</p>
					</div>
					<div className="text-center mid-section mx-0">
						<h6 className="p-1 mb-0">Receipt#: { sale?.receiptNumber }</h6>
						{/* <p className="receipt-number mb-0"><strong>Official Receipt</strong></p> */ }
					</div>
					<div className="my-4"></div>
					{ _.isEmpty( sale ) ? (
						<>
							<Spin spinning /> <span className="ms-2">loading...</span>
						</>
					) : (
						<>
							<div className="body">
								{ sale.details.map( ( s ) => (
									<div className="row m-0 g-1" key={ s.productId }>
										<div className="col-8 m-0">
											{ s.product.productName }
											<i className="ms-1">
												(<strong>{ s.quantity }</strong>@
												<strong>{ cedisLocale.format( s.unitPrice ) }</strong> )
											</i>
										</div>
										<div className="col-3 p-0 m-0" style={ { textAlign: "right" } }>
											<strong>
												{/* ₵{ " " } */ }
												{ cedisLocale.format(
													parseInt( s.quantity ) * parseFloat( s.unitPrice )
												) }
											</strong>
										</div>
										<Divider className="my-1" />
									</div>
								) ) }
							</div>
							<div className="footer">
								{
									sale.discount > 0 && (
										<>
											<div className="row g-0 m-0">
												<div
													className="col-6 text-right"
													style={ { textAlign: "right" } }>
													SUBTOTAL
												</div>
												<div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
													₵ { cedisLocale.format( parseFloat( sale.sumAmt || 0 ) ) }
												</div>
											</div>
											<div className="row g-0 m-0">
												<div
													className="col-6 text-right"
													style={ { textAlign: "right" } }>
													DISCOUNT
												</div>
												<div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
													₵ { cedisLocale.format( sale.discount || 0 ) }
												</div>
											</div>
										</>
									)

								}

								<div className="row g-0 m-0">
									<div
										className="col-6 text-right"
										style={ { textAlign: "right" } }>
										TOTAL
									</div>
									<div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
										₵
										<strong className="ms-1">
											{ cedisLocale.format(
												parseFloat( sale.sumAmt ) - parseFloat( sale.discount || 0 )
											) }
										</strong>
									</div>
								</div>
								{/* <Divider className="my-1" /> */ }
								<div className="row g-0 m-0">
									<div
										className="col-6 text-right"
										style={ { textAlign: "right" } }>
										{/* { sale.paymentMethod?.toUpperCase() } */ }
										PAID
									</div>
									<div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
										₵ { cedisLocale.format( sale.amountPaid || 0 ) }
									</div>
									<div
										className="col-6 text-right"
										style={ { textAlign: "right" } }>
										BALANCE:
									</div>
									<div className="col-5 m-0 p-0" style={ { textAlign: "right" } }>
										₵
										<strong className="ms-1">
											{ cedisLocale.format(
												( parseFloat( sale.sumAmt || 0 ) -
													parseFloat( sale.discount || 0 ) ) - parseFloat( sale.amountPaid || 0 )
											) }
										</strong>
									</div>
								</div>
								<Divider className="my-1" />
								<div className="text-left">
									<p className="m-0">
										<i>Sale Date: { new Date( sale.createdAt ).toDateString() }</i>
									</p>
									<p className="m-0">
										Sold by:{ " " }
										{ `${ sale.user.staff.firstName } ${ sale.user.staff.lastName }` }
									</p>
								</div>
								<Divider className="m-0" />
								<div className="my-1 mb-2">
									<small>
										<strong>receipt date:</strong>
										<span className="d-block">
											{ new Date().toUTCString() }
										</span>
									</small>
									<small className="d-block">
										&copy;{ new Date().getFullYear() } Waffle LLC (0509152188)
									</small>
									{/* <p className="my-3">
										---- END ----
									</p> */}
								</div>
							</div>
						</>
					) }
				</div>
				<Button
					type="primary"
					className="mt-3 d-flex align-items-center"
					onClick={ handlePrint }>
					<PrinterOutlined />
					Print
				</Button>

			</div>
			<div className="row mt-3">
				<div className="col-12">
					<Select placeholder="select printer size" defaultValue={ size } onChange={ handleSizeChange }>
						<Option value="58">Printer width: 58 mm</Option>
						<Option value="80">Printer width: 80 mm</Option>
					</Select>
				</div>
				<div className="col-12 mt-1">
					<Tag color="gold">selection will be remembered</Tag>
				</div>
			</div>
		</>
	);
};

export default SaleReceipt;
