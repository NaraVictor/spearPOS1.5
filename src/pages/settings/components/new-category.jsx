import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postData } from "./../../../helpers/api";

//
const NewCategory = ( props ) =>
{
	const { register, handleSubmit, reset } = useForm();
	const [ btnLabel, setLabel ] = useState( "Create Category" );
	const [ submitted, setSubmission ] = useState( false );
	const [ error, setError ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "An error has ocurred!" );
	const createBtn = (
		<button type="submit" className="mt-3 w-100 btn btn-primary">
			{ btnLabel }
		</button>
	);

	const onSubmit = async ( data ) =>
	{
		try
		{
			setError( false );
			setLabel( "Please wait..." );
			const category = await postData( "categories", data );

			if ( category.status === 200 )
			{
				setSubmission( true );
				reset();
				props.onDone();
				setLabel( "Create Category" );
				return;
			}

			setError( true );
			setLabel( "Create Category" );
			setErrMsg( "Request could not be completed." );
		} catch ( ex )
		{
			if ( ex.response.status === 409 )
			{
				setError( true );
				setLabel( "Create Category" );

				setErrMsg( "Category already exist" );
				return;
			}

			setError( true );
			setLabel( "Create Category" );
		}
	};

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
								<div className="col-12">
									<select
										id="type"
										required
										name="type"
										{ ...register( "type", { required: true } ) }
										className="custom-select form-control">
										<option defaultValue value="">
											select type
										</option>
										<option value="product">Products</option>
										<option value="expense">Expenses</option>
									</select>
								</div>
								<div className="col-12 my-2">
									<input
										{ ...register( "name", { required: true } ) }
										type="text"
										placeholder="category name"
										className="form-control"
									/>
								</div>
								<div className="col-12 mb-2">
									<textarea
										{ ...register( "description" ) }
										type="description"
										placeholder="category description"
										className="form-control"></textarea>
								</div>
							</div>

							{ createBtn }
						</form>
						{/* <p>
								<Link to="/login">login instead</Link>
							</p> */}
					</>
				) : (
					<div className="text-center">
						<p className="mt-3">
							Category created successfully.
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

export default NewCategory;
