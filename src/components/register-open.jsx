import { useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner1 } from "./spinner";
import { postData } from "../helpers/api";
import _ from "lodash";
import { toggleRegisterState } from "../helpers/utilities";

const OpenRegister = ( { onReload } ) => {
	const { handleSubmit, register, reset } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );


	const submitRegister = ( data ) => {
		setBusy( true );
		postData( "registers/open", {
			...data, openTime: Date.now()
		} )
			.then( ( res ) => {
				if ( res.status === 200 ) {
					setStatus( {
						success: true,
						successMsg: "register successfully opened",
					} );
					reset();
					onReload();
					toggleRegisterState( res.data.data )
				} else {
					setStatus( {
						err: true,
						errMsg: res.response.data.message,
					} );
				}
			} )
			.catch( ( ex ) => {
				setStatus( {
					err: true,
					errMsg: "Sorry, an error occurred",
				} );
				// reset();
			} )
			.finally( ( f ) => {
				setBusy( false );
			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ handleSubmit( submitRegister ) }>
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
								<label htmlFor="description">Opening Float *</label>
								<p className="text-secondary">Amount used to start business day</p>
								<input
									type="number"
									step="0.01"
									autoFocus
									className="form-control"
									placeholder="opening float"
									{ ...register( "openingFloat", { required: true } ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="contact">Notes</label>
								<textarea
									className="form-control"
									placeholder="opening notes (optional)"
									{ ...register( "openingNote" ) }
								></textarea>
							</div>


							<button className="btn btn-primary btn-lg" type="submit">
								Open Register
							</button>

							{ status.err && (
								<p className="text-white bg-danger my-2 p-2 rounded">
									{ !_.isArray( status.errMsg ) && status.errMsg }
									{ _.isArray( status.errMsg ) &&
										<ol>
											{ status.errMsg.map( e => {
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

export default OpenRegister;
