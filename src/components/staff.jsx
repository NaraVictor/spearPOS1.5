import { useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner1 } from "./spinner";
import { postData } from "../helpers/api";

const StaffForm = ( { onAdd } ) =>
{
	const { handleSubmit, register, reset } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );

	const submitProduct = ( data ) =>
	{
		setBusy( true );
		postData( "staffs", data )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Staff information added",
					} );
					reset();
					onAdd();
				} else
				{
					setStatus( {
						err: true,
						errMsg: "There was an error adding staff information",
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

	return (
		<div className="expense-box">
			<form onSubmit={ handleSubmit( submitProduct ) }>
				{ busy && (
					<div className="text-center">
						<Spinner1 />
						<p>please wait...</p>
					</div>
				) }
				{ !busy && (
					<>
						<div className="row">
							<div className="col-12">
								<label htmlFor="firstName">First Name *</label>
								<input
									type="text"
									autoFocus
									id="firstName"
									placeholder="first name"
									className="form-control"
									{ ...register( "firstName", { required: true } ) }
								/>
							</div>
							<div className="col-12 my-2">
								<label htmlFor="gender">Last Name *</label>
								<input
									type="text"
									id="lastName"
									placeholder="last name"
									className="form-control"
									{ ...register( "lastName", { required: true } ) }
								/>
							</div>
						</div>

						<div className="row g-0">
							<div className="col-md-5 col-12">
								<label htmlFor="gender">Gender *</label>

								<select
									name="gender"
									id="gender"
									className="form-control"
									{ ...register( "gender", { required: true } ) }>
									<option defaultValue value="">
										select gender
									</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</div>
							<div className="col-md-6 offset-1 col-12 mb-2">
								<label htmlFor="birthdate">Birthdate *</label>
								<input
									type="date"
									id="birthdate"
									placeholder="birthdate"
									className="form-control"
									{ ...register( "birthdate", { required: true } ) }
								/>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<label htmlFor="contact">Contact *</label>
								<input
									type="tel"
									id="contact"
									placeholder="staff primary contact"
									className="form-control"
									{ ...register( "contact", { required: true } ) }
								/>
							</div>
							<div className="col-12 my-2">
								<label htmlFor="email">Email</label>
								<input
									type="email"
									id="email"
									placeholder="staff primary email"
									className="form-control"
									{ ...register( "email" ) }
								/>
							</div>
						</div>

						<div className="row">
							<div className="col-6">
								<label htmlFor="position">Position</label>
								<input
									type="text"
									id="position"
									placeholder="staff position/office"
									className="form-control"
									{ ...register( "position" ) }
								/>
							</div>
							<div className="col-6">
								<label htmlFor="schedule">Schedule</label>
								<select
									name="schedule"
									id="schedule"
									className="form-control"
									{ ...register( "staffType" ) }>
									<option defaultValue value="">
										choose one
									</option>
									<option value="Full-time">Full-time</option>
									<option value="Part-time">Part-time</option>
									<option value="Contract">Contract</option>
								</select>
							</div>
						</div>
						<button className="btn btn-primary mt-3" type="submit">
							Add Staff
						</button>
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
					</>
				) }
			</form>
		</div>
	);
};

export default StaffForm;
