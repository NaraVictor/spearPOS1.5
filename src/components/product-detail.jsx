import { cedisLocale } from "../helpers/utilities";
import { format } from 'date-fns'
import { Divider, Tag } from "antd";

const ProductDetail = ( { prod } ) => {

	return (
		<>
			<div className="row mb-3">
				<div className="col-5">
					{
						prod.isAService && <Tag as color="geekblue"><strong>SERVICE</strong></Tag>
					}
				</div>
				{
					prod?.code &&
					<div className="col-5 p-1 text-center bg-success text-white rounded">
						barcode active ({ prod.code })
					</div>
				}
			</div>
			<div className="row">
				<div className="col-md-4">
					<h6 className="mb-0">
						<strong>GHS { cedisLocale.format( prod.purchasePrice ) }</strong>
					</h6>
					<small>Purchase Price</small>
				</div>

				<div className="col-md-4">
					<h6 className="mb-0">
						<strong>
							{ " " }
							GHS { cedisLocale.format( parseFloat( prod.sellingPrice ) ) }
						</strong>
					</h6>
					<small>Selling Price</small>
				</div>
				{
					!prod.isAService && (
						<div className="col-md-4">
							<h6 className="mb-0">
								<strong>{ prod.quantity }</strong>
							</h6>
							<small>Available Quantity</small>
						</div>
					)
				}
			</div>
			<div className="row my-4">
				{
					!prod.isAService && (
						<>
							<div className="col-md-4">
								<h6 className="mb-0">
									<strong>{ prod.minQty }</strong>
								</h6>
								<small>Restock Point</small>
							</div>
							<div className="col-md-4">
								<h6 className="mb-0">
									<strong>{ prod.maxQty }</strong>
								</h6>
								<small>Maximum Quantity</small>
							</div>
						</>

					)
				}

				<div className="col-md-4">
					<h6 className="mb-0">
						<strong>{
							prod.expiryDate && format(
								new Date( prod.expiryDate ),
								"MMMM dd, yy"
							)
						}</strong>
					</h6>
					<small>Expiry Date</small>
				</div>
			</div>
			<div className="row">
				<div className="col-md-4">
					<h6 className="mb-0">
						<strong>{ prod.location }</strong>
					</h6>
					<small>Location</small>
				</div>
				<div className="col-md-4">
					<h6 className="mb-0">
						<strong>{ prod.category.name }</strong>
					</h6>
					<small>Category</small>
				</div>

				{
					!prod.isAService && (
						<>
							<div className="col-md-4">
								<h6 className="mb-0">
									<strong>{ prod.restockQty }</strong>
								</h6>
								<small>Restock Quantity</small>
							</div>
						</>
					)
				}

			</div>
			<div className="row my-4">
				<div className="col-12">
					<h6 className="mb-0">
						<strong>{ prod?.supplier?.supplierName }</strong>
					</h6>
					<small>Supplier</small>
				</div>
			</div>
			<div className="row mt-4">
				<hr />
				<div className="col-12 ">
					<strong>Description</strong>
					<p className="mt-2 mb-0">{ prod.description }</p>
				</div>
			</div>
			<div className="row mt-3">
				<hr />
				<div className="col-md-6">
					<strong>Profit per unit: </strong>
					<span>
						GHS{ " " }
						{ cedisLocale.format(
							parseFloat( prod.sellingPrice ) - parseFloat( prod.purchasePrice )
						) }
					</span>
				</div>
				{
					!prod.isAService &&
					<div className="col-md-6">
						<strong>Total Profit: </strong>
						<span>
							GHS{ " " }
							{ cedisLocale.format(
								( parseFloat( prod.sellingPrice ) - parseFloat( prod.purchasePrice ) ) *
								parseInt( prod.quantity )
							) }
						</span>
					</div>
				}
			</div>
			<Divider />
			<div className="row">
				<div className="col-6">
					<div>
						{ format(
							new Date( prod.createdAt ),
							"EEE MMMM dd, yy"
						) }
					</div>
					<strong>Date Created </strong>

				</div>
				<div className="col-6">
					<div>
						{ format(
							new Date( prod.updatedAt ),
							"EEE MMMM dd, yy"
						) }
					</div>
					<strong>Date Modified </strong>

				</div>
			</div>
		</>
	);
};

export default ProductDetail;
