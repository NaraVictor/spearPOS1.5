import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authenticate, setRole } from "../../helpers/auth";
import { toggleRegisterState } from "./../../helpers/utilities";
import { fetchData, postData } from "./../../helpers/api";
import logo from "../../static/img/icon-lite.png";
import PageTitle from '../../components/page-title'
import { Button } from 'antd'

const LoginPage = ( props ) => {
	const { register, handleSubmit } = useForm();
	const [ loginError, setError ] = useState( false );
	const [ show, setShow ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "Login error" );
	const [ btnLabel, setLabel ] = useState( "Login" );
	const route = { ...props.location?.state };
	const [ isBusy, setBusy ] = useState( false )

	const history = useHistory();

	const setupRegister = () => {
		fetchData( "registers" ).then( ( res ) => {
			if ( res.status === 200 ) {
				const openedReg = res.data?.data?.filter( reg => reg.isClosed === false );
				toggleRegisterState( openedReg[ 0 ] ) //pick the first unclosed register
			}
		} );
	}


	const onSubmit = ( data ) => {
		setLabel( () => {
			return "Please wait...";
		} );
		setBusy( true )


		postData( "accounts/login", data, false )
			.then( ( res ) => {
				setupRegister();
				setError( false );
				authenticate( res.data.token, res.data.data );
				setRole( res.data.data.role );
				history.replace( route?.from?.pathname || "/" );
			} )
			.catch( ( err ) => {
				setError( true );
				setLabel( () => {
					return "Login";
				} );

				//messages
				if ( err.response?.status === 403 )
					return setErrMsg( "Access denied. You are not authorized" );

				if ( err.response?.status === 500 ) return setErrMsg( "Server error" );

				setErrMsg( "Invalid username or password" );
			} ).finally( () => {
				setBusy( false )
			} )
	};

	return (
		<div className="auth pt-5">
			<div className="row">
				<PageTitle title="Login" />
				<div className="col-md-3 col-10 mx-auto">
					<div className="inner admin-login ">
						<form onSubmit={ handleSubmit( onSubmit ) } autoComplete="off">
							<div className="text-center">
								<img src={ logo } alt="" height="80" />
								<h3 className="text-center mb-0">
									spearPOS
								</h3>
								<p className="text-secondary">retail point of sale</p>
								<p className="text-center mt-5">
									<strong>Login</strong>
								</p>
							</div>
							{ loginError && (
								<div className="bg-danger p-1 mb-3 text-center text-light rounded">
									<small>{ errMsg }</small>
								</div>
							) }
							<div className="row">
								<div className="col-12 mb-3">
									<input
										autoFocus
										type="text"
										label="Username"
										placeholder="username"
										className="w-100 form-control"
										{ ...register( "username", { required: true } ) }
									/>
								</div>
								<div className="col-12">
									<input
										required
										type={ `${ !show ? 'password' : 'text' }` }
										label="Password"
										placeholder="password"
										className="w-100 form-control"
										{ ...register( "password", { required: true } ) }
									/>
									<Button type="link" className="p-0" onClick={ () => setShow( !show ) }>
										show password
									</Button>
								</div>
							</div>

							<button disabled={ isBusy } type="submit" className="btn btn-primary w-100 my-4">
								{ btnLabel }
							</button>

							<div className="d-flex justify-content-between">
								{/* <small className="forgot-password">
								Forgot <Link to="/forgot-password">password?</Link>
							</small> */}
								{/* <Link to="/signup">Signup</Link> */ }
								<Link to="/change-password">Change password</Link>
							</div>
						</form>
						<small className="mt-1 d-block">&copy;{ new Date().getFullYear() } Waffle LLC All rights reserved.</small>
						<small className="d-block">version 1.5.0</small>
					</div>
				</div>

			</div>
		</div>
	);
};

export { LoginPage };
