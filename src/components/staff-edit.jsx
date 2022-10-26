import { useState, useEffect } from "react";
import { extractInputData } from "../helpers/utilities";
import { updateData } from "../helpers/api";
import { Button, Input, Select } from "antd";

const StaffEdit = ( { staff, onReload } ) =>
{
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );
	const [ record, setRecord ] = useState( {} );

	const { Option } = Select;

	//handlers
	const handleRecordChange = ( e, fieldName = "", isValueOnly = false ) =>
	{
		if ( isValueOnly )
		{
			//mostly coming drop -> ant design just gives only the value
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

	const updateStaff = ( e ) =>
	{
		const data = extractInputData( e );

		setBusy( true );
		updateData( "staffs", {
			...data,
			staffType: record.staffType,
			gender: record.gender,
			id: record.id,
		} )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Staff information updated",
					} );
					onReload();
				} else
				{
					setStatus( {
						err: true,
						errMsg: "There was an error updating staff information",
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
			.finally( () =>
			{
				setBusy( false );
				setTimeout( () =>
				{
					setStatus( {
						err: false,
						success: false,
					} );
				}, 10000 );
			} );
	};

	useEffect( () =>
	{
		setRecord( {
			birthdate: staff.birthdate,
			contact: staff.contact,
			email: staff.email,
			firstName: staff.firstName,
			gender: staff.gender,
			id: staff.id,
			lastName: staff.lastName,
			position: staff.position,
			staffType: staff.staffType, //schedule
		} );
	}, [ staff ] );

	return (
		<div className="expense-box">
			<form onSubmit={ ( e ) => updateStaff( e ) }>
				<div className="row">
					<div className="col-12">
						<label htmlFor="firstName">First Name *</label>
						<Input
							type="text"
							autoFocus
							name="firstName"
							required
							placeholder="first name"
							className="form-control"
							value={ record.firstName }
							onChange={ ( e ) => handleRecordChange( e ) }
						/>
					</div>
					<div className="col-12 my-2">
						<label htmlFor="gender">Last Name *</label>
						<Input
							type="text"
							name="lastName"
							placeholder="last name"
							className="form-control"
							required
							value={ record.lastName }
							onChange={ ( e ) => handleRecordChange( e ) }
						/>
					</div>
				</div>

				<div className="row g-0">
					<div className="col-md-5 col-12">
						<label htmlFor="gender">Gender *</label>

						<Select
							name="gender"
							value={ record.gender }
							required
							onChange={ ( e ) => handleRecordChange( e, "gender", true ) }
							id="gender"
							className="form-control">
							<Option defaultValue value="">
								select gender
							</Option>
							<Option value="Male">Male</Option>
							<Option value="Female">Female</Option>
						</Select>
					</div>
					<div className="col-md-6 offset-1 col-12 mb-2">
						<label htmlFor="birthdate">Birthdate</label>
						<Input
							type="date"
							name="birthdate"
							value={ record.birthdate }
							onChange={ ( e ) => handleRecordChange( e ) }
							placeholder="birthdate"
							className="form-control"
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						<label htmlFor="contact">Contact *</label>
						<Input
							type="tel"
							required
							value={ record.contact }
							onChange={ ( e ) => handleRecordChange( e ) }
							name="contact"
							id="contact"
							placeholder="staff primary contact"
							className="form-control"
						/>
					</div>
					<div className="col-12 my-2">
						<label htmlFor="email">Email</label>
						<Input
							type="email"
							name="email"
							id="email"
							value={ record.email }
							onChange={ ( e ) => handleRecordChange( e ) }
							placeholder="staff primary email"
							className="form-control"
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-6">
						<label htmlFor="position">Position</label>
						<Input
							type="text"
							value={ record.position }
							onChange={ ( e ) => handleRecordChange( e ) }
							name="position"
							id="position"
						/>
					</div>
					<div className="col-6">
						<label htmlFor="schedule">Schedule</label>
						<Select
							name="staffType"
							value={ record.staffType }
							onChange={ ( e ) => handleRecordChange( e, "staffType", true ) }
							id="schedule"
							className="form-control">
							<Option defaultValue value="">
								choose one
							</Option>
							<Option value="Full-time">Full-time</Option>
							<Option value="Part-time">Part-time</Option>
							<Option value="Contract">Contract</Option>
						</Select>
					</div>
				</div>
				<button id="submitter" hidden type="submit"></button>

				{ status.err && (
					<p className="text-white bg-danger my-2 p-2 rounded">
						{ status.errMsg }
					</p>
				) }
				{ status.success && (
					<p className="text-white bg-success my-2 p-2 rounded">
						{ status.successMsg }
					</p>
				) }
			</form>
			<Button
				loading={ busy ? true : false }
				className="btn btn-primary mt-3"
				onClick={ () =>
				{
					document.getElementById( "submitter" ).click();
				} }
				type="primary">
				{ busy ? "updating..." : "Update Staff" }
			</Button>
		</div>
	);
};

export default StaffEdit;
