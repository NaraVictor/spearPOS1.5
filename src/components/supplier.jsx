import { useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner1 } from "./spinner";
import { postData } from "../helpers/api";
import _ from "lodash";

const SupplierForm = ( { onReload } ) =>
{
	const { handleSubmit, register, reset } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );


	const submitSupplier = ( data ) =>
	{
		setBusy( true );
		postData( "suppliers", data )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Supplier added successfully",
					} );
					reset();
					onReload();
					setTimeout( () =>
					{
						setStatus( {
							err: false,
							success: false,
						} );
					}, 10000 );
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
				// reset();
			} )
			.finally( ( f ) =>
			{
				setBusy( false );
				// setTimeout( () =>
				// {
				// 	setStatus( {
				// 		err: false,
				// 		success: false,
				// 	} );
				// }, 5000 );
			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ handleSubmit( submitSupplier ) }>
				{ busy && (
					<div className="text-center">
						<Spinner1 />
						<p>please wait...</p>
					</div>
				) }
				{ !busy && (
					<div className="row">
						<div className="col-12">
							<div>
								<label htmlFor="description">Supplier Name *</label>
								<input
									type="text"
									autoFocus
									className="form-control"
									placeholder="describe expenditure"
									{ ...register( "supplierName", { required: true } ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="contact">Contact *</label>
								<input
									type="tel"
									maxLength={ 15 }
									className="form-control"
									placeholder="supplier contact number"
									{ ...register( "contact", { required: true } ) }
								/>
							</div>

							<div className="my-3">
								<label htmlFor="email">email</label>
								<input
									type="email"
									className="form-control"
									placeholder="email address of supplier"
									{ ...register( "email" ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="location">location *</label>
								<input
									type="text"
									className="form-control"
									placeholder="location of supplier"
									{ ...register( "location" ) }
								/>
							</div>
							<button className="btn btn-primary" type="submit">
								Add Supplier
							</button>

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
				) }
			</form>
		</div>
	);
};

export default SupplierForm;
