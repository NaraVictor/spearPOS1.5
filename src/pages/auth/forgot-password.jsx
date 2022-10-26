import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

// material ui
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core";
import { appUrl, openNotification } from "../../helpers/utilities";

const ForgotPassword = ( props ) =>
{
	const { register, handleSubmit, reset } = useForm();
	const [ loginError, setError ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "Error" );
	const [ btnLabel, setLabel ] = useState( "Forgot Password" );
	const route = { ...props.location?.state };

	const history = useHistory();
	const returnUrl = route?.from?.pathname;

	const onSubmit = ( data ) =>
	{
		setLabel( () =>
		{
			return "Forgetting...";
		} );

		axios
			.post( `${ appUrl }/accounts/forgot-password`, data, false )
			.then( ( res ) =>
			{
				setError( false );
				setLabel( () =>
				{
					return "Forgot Password";
				} );
				reset();

				if ( returnUrl ) return history.replace( returnUrl );
				openNotification( "Success", "Check your email for a new password" )
			} )
			.catch( ( err ) =>
			{
				setError( true );
				setLabel( () =>
				{
					return "Forgot Password";
				} );

				//messages
				if ( err.response?.status === 403 )
					return setErrMsg( "Access denied. You are not authorized" );

				if ( err.response?.status === 404 )
					return setErrMsg( "Account does not exist" );

				if ( err.response?.status === 500 ) return setErrMsg( "Server error" );

				setErrMsg( "Something went wrong. Contact Administrator" );
			} );
	};

	return (
		<div className={ `auth` }>
			<div className="outer">
				<div className="inner admin-login">
					<form onSubmit={ handleSubmit( onSubmit ) } autoComplete="off">
						<h3>
							<strong>Forgot Password</strong>
						</h3>
						{ loginError && (
							<div className="bg-danger p-1 mb-3 text-center text-white rounded">
								<small>{ errMsg }</small>
							</div>
						) }
						<Grid container spacing={ 1 }>
							<Grid item xs={ 12 }>
								<TextField
									autoFocus
									required
									type="email"
									label="Email"
									className="w-100"
									variant="outlined"
									{ ...register( "email", { required: true } ) }
								/>
							</Grid>
							<small className="ms-1 my-1 mb-2">
								submit your account email for a new password
							</small>
						</Grid>

						<p></p>

						<ThemeProvider>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								className="w-100">
								{ btnLabel }
							</Button>
						</ThemeProvider>

						<small className="forgot-password text-right d-inline-block mt-2">
							I'd rather <Link to="/change-password">change password</Link>
						</small>
					</form>
				</div>
			</div>
		</div>
	);
};

export { ForgotPassword };
