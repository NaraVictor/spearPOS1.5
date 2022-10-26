import { Alert, Button, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
import { fetchData, updateData } from "../../helpers/api";
// import { extractInputData } from "./../../helpers/utilities";

//
const EditUser = ( { user, onReload } ) =>
{
	const [ busy, setBusy ] = useState( false );
	const [ submitted, setSubmission ] = useState( false );
	const [ error, setError ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "An error has ocurred!" );
	const [ staffs, setStaff ] = useState( [] );
	const [ record, setRecord ] = useState( {} );

	const { Option } = Select;

	const onUpdateUser = async ( e ) =>
	{
		try
		{
			// const data = extractInputData( e );
			setError( false );
			setBusy( true );
			const signup = await updateData( "accounts/", record );

			if ( signup.status === 200 )
			{
				setSubmission( true );
				setBusy( false );
				onReload();
				return;
			}

			setError( true );
			setBusy( false );
			setErrMsg( "Request could not be completed." );
		} catch ( ex )
		{
			setBusy( false );
			setErrMsg( "Request not completed" );
			setError( true );
		}
	};

	const handleRecordChange = ( e ) =>
	{
		const { name, value } = e.target;
		setRecord( {
			...record,
			[ name ]: value,
		} );
	};

	const handleSelectChange = ( value, inputName ) =>
	{
		setRecord( {
			...record,
			[ inputName ]: value,
		} );
	};

	useEffect( () =>
	{
		setRecord( {
			id: user.id,
			username: user.username,
			email: user.email,
			staffId: user.staffId,
			staff: user.staff.firstName + " " + user.staff.lastName,
			role: user.role,
		} );

		fetchData( "staffs" ).then( ( res ) => setStaff( () => res.data.data ) );
	}, [ user ] );

	return (
		<div className="auth">
			<div className="outer pb-3">
				{ error && (
					<Alert
						type="error"
						className="mb-3"
						message={ errMsg }
						showIcon
						closable
					/>
				) }

				<form onSubmit={ ( e ) => onUpdateUser( e ) }>
					<div className="row">
						<div className="col-12 mb-2">
							<Select
								id="staffId"
								name="staffId"
								required
								value={ record.staff }
								onChange={ ( v ) =>
								{
									const fs = staffs.filter( ( s ) => s.id === parseInt( v ) )[ 0 ];
									handleSelectChange( fs.firstName + " " + fs.lastName, "staff" );
									setRecord( {
										...record,
										staffId: parseInt( v ),
									} );
								} }
								placeholder="select staff"
								className="w-100">
								{ staffs.map( ( s ) => (
									<Option value={ `${ s.id }` }>
										{ s.firstName } { s.lastName }
									</Option>
								) ) }
							</Select>
						</div>
						<div className="col-12">
							<Select
								id="role"
								name="role"
								required
								value={ record.role }
								onChange={ ( v ) => handleSelectChange( v, "role" ) }
								placeholder="select role"
								className="w-100">
								<Option value="admin">Admin</Option>
								<Option value="manager">Manager</Option>
								<Option value="accounts">Accounts</Option>
								<Option value="attendant">Attendant</Option>
							</Select>
						</div>
						<div className="col-12 my-2">
							<Input
								type="text"
								placeholder="username"
								className="form-control"
								value={ record.username }
								name="username"
								required
								onChange={ ( v ) => handleRecordChange( v ) }
							/>
						</div>
						<div className="col-12 mb-2">
							<Input
								type="email"
								placeholder="email"
								className="form-control"
								name="email"
								value={ record.email }
								onChange={ ( v ) => handleRecordChange( v ) }
							/>
						</div>
					</div>
					<button id="submitter" hidden type="submit"></button>
				</form>
				<Button
					loading={ busy }
					type="primary"
					className="my-3 w-100"
					onClick={ () =>
					{
						document.getElementById( "submitter" ).click();
					} }>
					{ busy ? "updating..." : "Update User" }
				</Button>
				{ submitted && (
					<Alert
						type="success"
						message="user information successfully updated!"
						showIcon
						closable
					/>
				) }
			</div>
		</div>
	);
};

export default EditUser;
