import { useState, useEffect } from "react";
import { updateData } from "../helpers/api";
import { Button, Input, Select } from "antd";
import { extractInputData } from "../helpers/utilities";
import _ from "lodash";

const CustomerEdit = ( { data, onReload } ) =>
{
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );
	const [ record, setRecord ] = useState( {} );
	const [ dropdown, setDropDown ] = useState( {
		gender: "",
		category: ""
	} )

	// variables
	const { Option } = Select;

	const changeSelect = ( value, name ) =>
	{
		setDropDown( {
			...dropdown,
			[ name ]: value,
		} );
	};

	useEffect( () =>
	{
		setRecord( {
			id: data.id,
			name: data.name,
			primaryContact: data.primaryContact,
			secondaryContact: data.secondaryContact,
			email: data.email,
			address: data.address,
		} );

		setDropDown( {
			gender: data.gender,
			category: data.category
		} )
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


	const updateCustomer = ( e ) =>
	{
		const data = extractInputData( e );

		setBusy( true );
		updateData( "customers", {
			...data,
			id: record.id,
			...dropdown
		} )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Customer info updated successfully",
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
			<form onSubmit={ ( e ) => updateCustomer( e ) }>
				<div className="row">
					<div className="col-12">
						<div>
							<label htmlFor="name">Customer Name *</label>
							<Input
								type="text"
								autoFocus
								className="form-control"
								placeholder="name of customer"
								name="name"
								required
								value={ record.name }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div className="my-3">
							<label htmlFor="primaryContact">Primary Contact *</label>
							<Input
								type="tel"
								maxLength={ 15 }
								name="primaryContact"
								required
								className="form-control"
								placeholder="input customer primary contact"
								value={ record.primaryContact }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>

						<div className="my-3">
							<label htmlFor="secondaryContact">Secondary Contact</label>
							<Input
								type="tel"
								maxLength={ 15 }
								name="secondaryContact"
								className="form-control"
								placeholder="input secondaryContact spent"
								value={ record.secondaryContact }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div className="my-3">
							<label htmlFor="categories">Gender *</label>
							<Select
								required
								name="categoryId"
								className="custom-select form-control"
								value={ dropdown.gender }
								onChange={ ( value ) => changeSelect( value, 'gender' ) }>
								<Option value="male">Male</Option>
								<Option value="female">Female</Option>
								<Option value="n/a">Not Applicable</Option>
							</Select>
						</div>
						<div className="my-3">
							<label htmlFor="categories">Category *</label>
							<Select
								required
								name="categoryId"
								className="custom-select form-control"
								value={ dropdown.category }
								onChange={ ( value ) => changeSelect( value, 'category' ) }>
								<Option value="individual">Individual</Option>
								<Option value="organization">Organization</Option>
							</Select>
						</div>

						<div>
							<label htmlFor="email">Email</label>
							<Input
								type="email"
								name="email"
								className="form-control"
								placeholder="customer email"
								value={ record.email }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div className="my-3">
							<label htmlFor="address">Address or Location</label>
							<Input
								type="text"
								name="address"
								className="form-control"
								placeholder="address or location of customer"
								value={ record.address }
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
				{ busy ? "Updating..." : "Update Customer" }
			</Button>
		</div>
	);
};

export default CustomerEdit;
