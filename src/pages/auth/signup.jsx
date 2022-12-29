import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchData, postData } from "./../../helpers/api";
import checkIcon from "../../static/img/user.png";

//
const SignUpPage = ( props ) => {
	const { register, handleSubmit, reset } = useForm();
	const [ btnLabel, setLabel ] = useState( "Create Account" );
	const [ submitted, setSubmission ] = useState( false );
	const [ error, setError ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "An error has ocurred!" );
	const [ staffs, setStaff ] = useState( [] );

	const signupBtn = (
		<button type="submit" className="mt-3 w-100 btn btn-primary">
			{ btnLabel }
		</button>
	);

	const onSubmit = async ( data ) => {
		try {
			setError( false );
			setLabel( "Please wait..." );
			const signup = await postData( "accounts/signup", data, false );

			if ( signup.status === 200 ) {
				setSubmission( true );
				reset();
				props.onDone();
				return;
			}

			setError( true );
			setLabel( "Create Account" );
			setErrMsg( "Request could not be completed. Staff may have an account" );
		} catch ( ex ) {
			if ( ex.response.status === 409 ) {
				setError( true );
				setLabel( "Create Account" );
				setErrMsg( "User already exist" );
				return;
			}

			setError( true );
			setLabel( "Create Account" );
		}
	};

	useEffect( () => {
		fetchData( "staffs" ).then( ( res ) => setStaff( () => res.data.data ) );
	}, [] );

	return (
		<div className="auth">
			<div className="outer py-3">
				{ submitted === false ? (
					<>
						{ error && (
							<div className="bg-danger p-2 mb-3 text-center text-white">
								<small>{ errMsg }</small>
							</div>
						) }

						<form onSubmit={ handleSubmit( onSubmit ) }>
							<div className="row">
								<div className="col-12 mb-2">
									<select
										id="staffId"
										required
										name="staffId"
										{ ...register( "staffId", { required: true } ) }
										className="custom-select form-control">
										<option defaultValue value="">
											select staff
										</option>
										{ staffs.map( ( s ) => (
											<option value={ `${ s.id }` }>
												{ s.firstName } { s.lastName }
											</option>
										) ) }
									</select>
								</div>
								<div className="col-12">
									<select
										id="role"
										required
										name="role"
										{ ...register( "role", { required: true } ) }
										className="custom-select form-control">
										<option defaultValue value="">
											select role
										</option>
										<option value="admin">Admin</option>
										<option value="manager">Manager</option>
										<option value="accounts">Accounts</option>
										{/* <option value="" disabled>Manager (PRO)</option>
										<option value="" disabled>Accounts (PRO)</option> */}
										<option value="attendant">Attendant</option>
									</select>
								</div>
								<div className="col-12 my-2">
									<input
										{ ...register( "username", { required: true } ) }
										type="text"
										placeholder="username"
										className="form-control"
									/>
								</div>
								<div className="col-12 mb-2">
									<input
										{ ...register( "email", { required: true } ) }
										type="email"
										placeholder="email"
										className="form-control"
									/>
								</div>
								<div className="col-12">
									<input
										{ ...register( "password", { required: true } ) }
										type="password"
										placeholder="password"
										className="form-control"
									/>
								</div>
							</div>

							{ signupBtn }
						</form>
						{/* <p>
								<Link to="/login">login instead</Link>
							</p> */}
					</>
				) : (
					<div className="text-center">
						<img src={ checkIcon } alt="account icon" height="100" />
						<p className="mt-3">
							User Account successfully created
							{/* Check your email for
								confirmation */}
						</p>
						<button
							className="btn btn-secondary"
							onClick={ () => setSubmission( false ) }>
							Add another
						</button>
					</div>
				) }
			</div>
		</div>
	);
};

export default SignUpPage;
