import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postData } from "../../../helpers/api";
import _ from "lodash";
import { Button } from "antd";
//
const NewSubCategory = ( { category, onDone } ) =>
{
	const { register, handleSubmit, reset } = useForm();
	const [ btnLabel, setLabel ] = useState( "Add Sub Category" );
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
			const category = await postData( "sub-categories", data );

			if ( category.status === 200 )
			{
				setSubmission( true );
				reset();
				onDone();
				setLabel( "Add Sub Category" );
				return;
			}

			setError( true );
			setLabel( "Try again!" );
			setErrMsg( "Request could not be completed." );
		} catch ( ex )
		{
			if ( ex.response.status === 409 )
			{
				setError( true );
				setLabel( "Add Sub Category" );

				setErrMsg( "Sub Category already exist" );
				return;
			}

			setError( true );
			setLabel( "Add Sub Category" );
		}
	};

	return (
		<div className="auth">
			<div className="outer pb-3">
				{ _.isEmpty( category ) ? (
					<p>No category selected. Click a category and try again</p>
				) : submitted === false ? (
					<>
						{ error && (
							<div className="bg-danger p-2 mb-3 text-center text-white">
								<small>{ errMsg }</small>
							</div>
						) }

						<form onSubmit={ handleSubmit( onSubmit ) }>
							<div className="row">
								<div className="col-12">
									<input
										{ ...register( "categoryId", { required: true } ) }
										type="text"
										value={ category.id }
										className="form-control d-none"
									/>
								</div>
								<div className="col-12">
									<small>Parent Category</small>
									<h5>{ category.name }</h5>
								</div>
								<div className="col-12 mb-2">
									<input
										{ ...register( "name", { required: true } ) }
										type="text"
										placeholder="sub category name"
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
							Sub Category created successfully.
							{/* Check your email for
								confirmation */}
						</p>
						<Button
							type="primary"
							size="large"
							onClick={ () => setSubmission( false ) }>
							Add another
						</Button>
					</div>
				) }
			</div>
		</div>
	);
};

export default NewSubCategory;
