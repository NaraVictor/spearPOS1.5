import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postData } from "./../../helpers/api";
import { openNotification } from "../../helpers/utilities";

const ChangePassword = ( props ) =>
{
	const { register, handleSubmit, reset } = useForm();
	const [ loginError, setError ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "Error" );
	const [ btnLabel, setLabel ] = useState( "Change Password" );

	const onSubmit = ( data ) =>
	{
		setLabel( () =>
		{
			return "Changing...";
		} );

		postData( `accounts/change-password`, data, false )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setError( false );
					setLabel( () =>
					{
						return "Change Password";
					} );
					// authenticate(res.data.token);
					// setRole(res.data.user.role);

					// if (returnUrl) return history.replace(returnUrl);
					reset();

					openNotification( "success", "Password Successfully Changed. Login to continue...", 'success' )
				}
			} )
			.catch( ( err ) =>
			{
				//messages
				if ( err.response?.status === 403 )
					return setErrMsg( "Access denied. You are not authorized" );

				if ( err.response?.status === 404 )
					return setErrMsg( "Account does not exist" );

				if ( err.response?.status === 400 ) return setErrMsg( "Invalid password" );

				if ( err.response?.status === 304 )
					return setErrMsg( "Current and new passwords are the same" );

				if ( err.response?.status === 500 ) return setErrMsg( "Server error" );

				setError( true );
				setErrMsg( "Error" );
			} )
			.finally( () =>
			{
				setLabel( () =>
				{
					return "Change Password";
				} );
			} );
	};

	return (
		<div className="w-25 mx-auto">
			<div className="p-3 bg-white rounded shadow mt-5">
				<div className="inner admin-login">
					<form onSubmit={ handleSubmit( onSubmit ) } autoComplete="off">
						<h3 className="text-center">
							<strong>Change Password</strong>
						</h3>
						{ loginError && (
							<div className="bg-danger p-1 mb-3 text-center text-white rounded">
								<small>{ errMsg }</small>
							</div>
						) }
						<div className="row my-4">
							<div className="col-12">
								<input
									autoFocus
									required
									type="email"
									placeholder="email"
									className="w-100 form-control"
									{ ...register( "email", { required: true } ) }
								/>
							</div>
							<div className="col-12 my-3">
								<input
									required
									type="password"
									variant="outlined"
									placeholder="Current Password"
									className="w-100 form-control"
									{ ...register( "currentPassword", { required: true } ) }
								/>
							</div>
							<div className="col-12">
								<input
									required
									type="password"
									placeholder="New Password"
									className="w-100 form-control"
									{ ...register( "newPassword", { required: true } ) }
								/>
							</div>
						</div>
						<p></p>

						<button type="submit" className="w-100 btn btn-primary mb-3">
							{ btnLabel }
						</button>

						{/* <small className="forgot-password mt-3 d-inline-block">
							I rather <Link to="/forgot-password">forgot password</Link>
						</small> */}
						<p className="forgot-password mt-3 d-inline-block text-center">
							<Link to="/login">Login</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export { ChangePassword };
