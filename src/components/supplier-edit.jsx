import { useState, useEffect } from "react";
import { updateData } from "../helpers/api";
import { Button, Input } from "antd";
import { extractInputData } from "../helpers/utilities";
import _ from "lodash";

const SupplierEdit = ( { data, onReload } ) =>
{
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );
	const [ record, setRecord ] = useState( {} );


	useEffect( () =>
	{
		setRecord( {
			id: data.id,
			supplierName: data.supplierName,
			contact: data.contact,
			email: data.email,
			location: data.location,
		} );
	}, [ data ] );

	//handlers
	const handleRecordChange = ( e, fieldName = "", isValueOnly = false ) =>
	{
		if ( isValueOnly )
		{
			//mostly drop drop -> ant design just gives only the value
			setRecord( {
				...record,
				[ fieldName ]: e,
			} );
			return;
		}

		const { name, value } = e.target;
		setRecord( {
			...record,
			[ name ]: value,
		} );
	};


	const updateSupplier = ( e ) =>
	{
		const data = extractInputData( e );

		setBusy( true );
		updateData( "suppliers", {
			...data,
			id: record.id,
		} )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Supplier info updated successfully",
					} );
					onReload();
					setTimeout( () =>
					{
						setStatus( {
							err: false,
							success: false,
						} );
					}, 5000 );
				} else
				{
					setStatus( {
						err: true,
						errMsg: res.response.data.message,
					} );
				}
			} )
			.catch( ( ex ) =>
			{
				setStatus( {
					err: true,
					errMsg: "Sorry, an error occurred",
				} );

				// onReload();
			} )
			.finally( ( f ) =>
			{
				setBusy( false );
			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ ( e ) => updateSupplier( e ) }>
				<div className="row">
					<div className="col-12">
						<div>
							<label htmlFor="supplierName">Supplier Name *</label>
							<Input
								type="text"
								autoFocus
								className="form-control"
								placeholder="name of supplier"
								name="supplierName"
								required
								value={ record.supplierName }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div className="my-3">
							<label htmlFor="contact">Contact *</label>
							<Input
								type="text"
								maxLength={ 15 }
								name="contact"
								required
								className="form-control"
								placeholder="input contact spent"
								value={ record.contact }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div>
							<label htmlFor="email">Email</label>
							<Input
								type="email"
								name="email"
								className="form-control"
								placeholder="supplier email"
								value={ record.email }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div className="my-3">
							<label htmlFor="location">Location *</label>
							<Input
								type="text"
								name="location"
								className="form-control"
								placeholder="location of supplier"
								value={ record.location }
								required
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>

						{ status.err && (
							<p className="text-white bg-danger my-2 p-2 rounded">
								{ !_.isArray( status.errMsg ) && status.errMsg }
								{ _.isArray( status.errMsg ) &&
									<ol>
										{ status.errMsg.map( e =>
										{
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
					</div>
				</div>
				<button id="submitter" hidden type="submit"></button>
			</form>
			<Button
				onClick={ () =>
				{
					document.getElementById( "submitter" ).click();
				} }
				type="primary"
				loading={ busy ? true : false }
			>
				{ busy ? "Updating..." : "Update Supplier" }
			</Button>
		</div>
	);
};

export default SupplierEdit;
