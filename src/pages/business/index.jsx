import PageTitle from "./../../components/page-title";
import { Alert, Divider, Modal, PageHeader } from "antd";
import { Button } from "antd";
import { EditOutlined, PlusCircleFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { fetchData } from "../../helpers/api";
import _ from "lodash";
import CompanyAdd from "./company-new";
import CompanyEdit from "./company-edit";
import { getRole } from "../../helpers/auth";

const BusinessPage = ( props ) =>
{
	const [ company, setCompany ] = useState( {} );
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

	const fetchCompanyRecord = () =>
	{
		fetchData( "company" ).then(
			( res ) => res.status === 200 && setCompany( res.data.data[ 0 ] )
		);
	};

	useEffect( () =>
	{
		fetchCompanyRecord();
	}, [] );

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
			<PageTitle title="Business" />
			<div className="row">
				<div className="col-9 mx-auto">
					<div className="d-flex align-items-center justify-content-between my-4">
						<PageHeader
							ghost={ false }
							title="Business Information"
							className="site-page-header"
							onBack={ () => window.history.go( -1 ) }
							subTitle="view and setup business details"></PageHeader>
						{ getRole() === ( "admin" || "manager" ) && (
							<div className="d-flex">
								{ _.isEmpty( company ) && (
									<Button
										type="primary"
										size="large"
										className="d-flex align-items-center"
										onClick={ () =>
											showModal(
												"Add Business",
												<CompanyAdd onReload={ fetchCompanyRecord } />
											)
										}>
										<PlusCircleFilled />
										Add Business Details
									</Button>
								) }
								{ !_.isEmpty( company ) && (
									<Button
										type="primary"
										size="large"
										className="d-flex align-items-center ms-2"
										onClick={ () =>
											showModal(
												"Editing Business Record",
												<CompanyEdit
													company={ company }
													onReload={ fetchCompanyRecord }
												/>
											)
										}>
										<EditOutlined />
										Edit
									</Button>
								) }
							</div>
						) }
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-9 mx-auto">
					<div className="shadow-sm bg-white p-5">
						{ _.isEmpty( company ) ? (
							<Alert
								type="info"
								description="We did not find any business records in the system. This will affect output on sales receipts and other areas"
								showIcon
								message="Add business records"
							/>
						) : (
							<>
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">Business Name:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.companyName }
									</div>
								</div>
								<Divider />
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">Primary Contact:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.primaryContact }
									</div>
								</div>
								<Divider />
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">Secondary Contact:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.secondaryContact }
									</div>
								</div>
								<Divider />
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">Email:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.email }
									</div>
								</div>
								<Divider />
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">GPS Address:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.gps }
									</div>
								</div>
								<Divider />
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">Location Address:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.address }
									</div>
								</div>
								<Divider />
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">VAT Number:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.VAT }
									</div>
								</div>
								<Divider />
								<div className="row m-0">
									<div className="col-2">
										<p className="h6">TIN Number:</p>
									</div>
									<div className="col-10" style={ { fontSize: "18px" } }>
										{ company.TIN }
									</div>
								</div>
							</>
						) }
					</div>
				</div>
			</div>
		</div>
	);
};

export { BusinessPage };
