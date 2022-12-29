import { useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner1 } from "./spinner";
import { postData } from "../helpers/api";
import _ from "lodash";

const CustomerForm = ( { onReload } ) =>
{
	const { handleSubmit, register, reset } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );


	const submitCustomer = ( data ) =>
	{
		setBusy( true );
		postData( "customers", data )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Customer added successfully",
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

			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ handleSubmit( submitCustomer ) }>
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
								<label htmlFor="name">Customer Name *</label>
								<input
									type="text"
									autoFocus
									id="name"
									className="form-control"
									placeholder="customer name"
									{ ...register( "name", { required: true } ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="contact">Primary Contact *</label>
								<input
									type="tel"
									maxLength={ 15 }
									id="primaryContact"
									className="form-control"
									placeholder="customer primary contact number"
									{ ...register( "primaryContact", { required: true } ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="contact">Secondary Contact</label>
								<input
									type="tel"
									maxLength={ 15 }
									id="secondaryContact"
									className="form-control"
									placeholder="customer secondary contact number"
									{ ...register( "secondaryContact" ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="gender">Gender *</label>
								<select
									name="gender"
									id="gender"
									{ ...register( "gender", { required: true } ) }
									className="custom-select form-control"
								>
									<option defaultValue value="">
										select a gender
									</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="n/a">Not Applicable</option>
								</select>
							</div>

							<div className="my-3">
								<label htmlFor="category">Category *</label>
								<select
									name="category"
									id="category"
									{ ...register( "category", { required: true } ) }
									className="custom-select form-control"
								>
									<option defaultValue value="">
										customer type
									</option>
									<option value="individual">Individual</option>
									<option value="organization">Oragnization</option>
								</select>
							</div>


							<div className="my-3">
								<label htmlFor="email">Email</label>
								<input
									type="email"
									className="form-control"
									placeholder="email address of customer"
									{ ...register( "email" ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="address">Address or Location</label>
								<input
									type="text"
									className="form-control"
									placeholder="address or location of customer"
									{ ...register( "address" ) }
								/>
							</div>

							<button className="btn btn-primary" type="submit">
								Add Customer
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

export default CustomerForm;
