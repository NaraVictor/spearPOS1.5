import { Alert, Button } from "antd";
import { useEffect, useState } from "react";
import { updateData } from "../../helpers/api";
import { extractInputData } from "./../../helpers/utilities";

const CompanyEdit = ( { company, onReload } ) =>
{
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );
	const [ record, setRecord ] = useState( {} );

	const updateCompany = ( e ) =>
	{
		const data = extractInputData( e );

		setBusy( true );
		updateData( "company", { ...data, id: company.id } )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Business records successfully Updated!",
					} );
					onReload();
				}
				if ( res.status === 400 )
				{
					setStatus( {
						err: true,
						errMsg:
							"There was an error. Please ensure all required fields are completed",
					} );
				}
			} )
			.catch( ( ex ) =>
			{
				setStatus( {
					err: true,
					errMsg: "Sorry, an error occurred",
				} );
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

	const handleRecordChange = ( e ) =>
	{
		const { name, value } = e.target;
		setRecord( {
			...record,
			[ name ]: value,
		} );
	};

	useEffect( () =>
	{
		setRecord( {
			id: company.id,
			companyName: company.companyName,
			primaryContact: company.primaryContact,
			secondaryContact: company.secondaryContact,
			email: company.email,
			TIN: company.TIN,
			VAT: company.VAT,
			address: company.address,
			gps: company.gps,
		} );
	}, [ company ] );
	return (
		<div className="expense-box">
			<form onSubmit={ ( e ) => updateCompany( e ) }>
				{ status.err && <Alert type="error" message={ status.errMsg } /> }
				<div className="mt-2">
					<label htmlFor="companyName">Business Name *</label>
					<input
						type="text"
						id="companyName"
						autoFocus
						required
						className="form-control"
						placeholder="business name"
						name="companyName"
						value={ record.companyName }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="primaryContact">Primary Contact *</label>
					<input
						type="tel"
						id="primaryContact"
						className="form-control"
						required
						placeholder="input primary contact number"
						name="primaryContact"
						value={ record.primaryContact }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="secondaryContact">Secondary Contact</label>
					<input
						type="tel"
						id="secondaryContact"
						className="form-control"
						placeholder="input primary contact number"
						name="secondaryContact"
						value={ record.secondaryContact }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="email">Email Address</label>
					<input
						type="email"
						id="email"
						className="form-control"
						placeholder="official email for business"
						name="email"
						value={ record.email }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="TIN">TIN Number *</label>
					<input
						type="text"
						id="TIN"
						required
						className="form-control"
						placeholder="business TIN number"
						name="TIN"
						value={ record.TIN }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="VAT">VAT Number</label>
					<input
						type="text"
						id="VAT"
						className="form-control"
						placeholder="business VAT Reg no."
						name="VAT"
						value={ record.VAT }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="address">Business Location Address</label>
					<input
						type="text"
						id="address"
						className="form-control"
						placeholder="location address of business"
						name="address"
						value={ record.address }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<div className="my-3">
					<label htmlFor="gps">GPS Address *</label>
					<input
						type="text"
						id="gps"
						className="form-control"
						placeholder="gps address of business"
						name="gps"
						required
						value={ record.gps }
						onChange={ ( v ) => handleRecordChange( v ) }
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
				{ busy ? "updating..." : "Update Record" }
			</Button>
			{ status.success && <Alert type="success" message={ status.successMsg } /> }
		</div>
	);
};

export default CompanyEdit;
