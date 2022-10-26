import { Alert, Button } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { postData } from "../../helpers/api";

const CompanyAdd = ( { onReload } ) =>
{
	const { handleSubmit, register, reset } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );

	const addCompany = ( data ) =>
	{
		setBusy( true );
		postData( "company", data )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Business successfully created!",
					} );
					reset();
				}
				if ( res.status === 400 )
				{
					setStatus( {
						err: true,
						errMsg:
							"There was an error. Please ensure all required fields are completed",
					} );
					// reset();
				}
			} )
			.catch( ( ex ) =>
			{
				setStatus( {
					err: true,
					errMsg: "Sorry, an error occurred",
				} );
				reset();
			} )
			.finally( ( f ) =>
			{
				setBusy( false );
				setTimeout( () =>
				{
					setStatus( {
						err: false,
						success: false,
					} );
				}, 5000 );
			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ handleSubmit( addCompany ) }>
				{ status.err && <Alert type="error" message={ status.errMsg } /> }
				<div className="mt-2">
					<label htmlFor="companyName">Business Name *</label>
					<input
						type="text"
						id="companyName"
						autoFocus
						className="form-control"
						placeholder="company name"
						{ ...register( "companyName", { required: true } ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="primaryContact">Primary Contact *</label>
					<input
						type="tel"
						id="primaryContact"
						className="form-control"
						placeholder="input primary contact number"
						{ ...register( "primaryContact", { required: true } ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="secondaryContact">Secondary Contact</label>
					<input
						type="tel"
						id="secondaryContact"
						className="form-control"
						placeholder="input primary contact number"
						{ ...register( "secondaryContact" ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="email">Email Address</label>
					<input
						type="email"
						id="email"
						className="form-control"
						placeholder="official email for business"
						{ ...register( "email" ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="TIN">TIN Number *</label>
					<input
						type="text"
						id="TIN"
						className="form-control"
						placeholder="business TIN number"
						{ ...register( "TIN", { required: true } ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="VAT">VAT Number</label>
					<input
						type="text"
						id="VAT"
						className="form-control"
						placeholder="business VAT Reg no."
						{ ...register( "VAT" ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="address">Business Location Address</label>
					<input
						type="text"
						id="address"
						className="form-control"
						placeholder="location address of business"
						{ ...register( "address" ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="gps">GPS Address</label>
					<input
						type="text"
						id="gps"
						className="form-control"
						placeholder="gps address of business"
						{ ...register( "gps" ) }
					/>
				</div>

				<button id="submitter" hidden type="submit"></button>
			</form>
			<Button
				type="primary"
				size="large"
				loading={ busy ? true : false }
				onClick={ () =>
				{
					document.getElementById( "submitter" ).click();
				} }
				className="mb-3">
				{ busy ? "add..." : "Add Business" }
			</Button>
			{ status.success && <Alert type="success" message={ status.successMsg } /> }
		</div>
	);
};

export default CompanyAdd;
