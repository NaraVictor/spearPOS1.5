import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner1 } from "./spinner";
import { fetchData, postData } from "../helpers/api";
import _ from "lodash";
import { cedisLocale, getRegister, toggleRegisterState } from "../helpers/utilities";
import smalltalk from 'smalltalk'

const CloseRegister = ( { onReload } ) =>
{
	const { handleSubmit, register, reset, watch } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );
	const [ curRegister, setCurRegister ] = useState( {} );
	const [ expected, setExpected ] = useState( 0 );

	const openRegister = getRegister()

	const diff = parseFloat( watch( "counted" ) ) - expected

	const fetchRegister = () =>
	{
		fetchData( `registers/${ openRegister.id }` ).then(
			res =>
			{
				if ( res.status === 200 )
				{
					setCurRegister( res.data.data )
					setExpected( parseFloat( res.data.data.payments[ 0 ]?.expected || 0 ) )
				}
			}
		)
	}

	const submitRegister = ( data ) =>
	{
		// commit confirmation
		if ( parseFloat( data.counted ) < 0 )
		{
			setStatus( {
				err: true,
				errMsg: "counted input is invalid. enter zero if there is no cash",
			} )
			return
		}


		smalltalk.confirm(
			"Close Register", "Are you sure about closing the register?. Continue?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},

		}
		).then( ok =>
		{

			setBusy( true );

			postData( "registers/close", {
				...data, closeTime: new Date(), expected, difference: diff, id: curRegister.id
			} )
				.then( ( res ) =>
				{
					if ( res.status === 200 )
					{
						setStatus( {
							success: true,
							successMsg: "register successfully closed",
						} );
						reset();
						onReload();
						toggleRegisterState()
						return
					}

					setStatus( {
						err: true,
						errMsg: res.response.data.message,
					} );
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

		} ).catch( ex =>
		{
			console.log( ex );
			return false
		} )
	};


	useEffect( () =>
	{
		fetchRegister()
	}, [] )

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
					<>
						<div className="row">
							<div className="col-12">
								<h5>Register Details</h5>
								<table className="table table-stripe">
									<tbody>
										<tr>
											<td><strong>Sequence: </strong></td>
											<td>#{ curRegister.sequence }</td>
										</tr>
										<tr>
											<td><strong>Open Time: </strong></td>
											<td>{ new Date( curRegister.openTime ).toUTCString() }</td>
										</tr>
										<tr>
											<td><strong>Opening Note: </strong></td>
											<td>{ curRegister.openingNote }</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<h5 className="mt-3">Closing Summary</h5>
						<div className="row my-3">
							<div className="col-4">
								<label htmlFor="expected"><strong>Expected Cash</strong></label>
								<p className="text-secondary">expected cash amount from sales</p>
								<h6>
									{ cedisLocale.format( expected ) }
								</h6>
							</div>
							<div className="col-4">
								<div>
									<label htmlFor="counted"><strong>Counted</strong></label>
									<p className="text-secondary">physical cash amount counted</p>
									<input
										type="number"
										step="0.01"
										name="counted"
										min="0"
										defaultValue="0"
										autoFocus
										className="form-control"
										placeholder="counted"
										{ ...register( "counted", { required: true } ) }
									/>
								</div>
							</div>
							<div className="col-4">
								<label htmlFor="difference"><strong>Difference</strong></label>
								<p className="text-secondary">variance in expected and counted cash</p>
								<h6 className={ `${ diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : 'text-secondary' }` }>
									{ cedisLocale.format( diff ) }
								</h6>
							</div>
						</div>

						<div className="row">
							<div className="mb-4">
								<label htmlFor="contact">Closing Notes</label>
								<textarea
									className="form-control"
									placeholder="closing notes (optional)"
									{ ...register( "closingNote" ) }
								></textarea>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<button className="btn btn-primary btn-lg" type="submit">
									Close Register
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
					</>
				) }
			</form>
		</div >
	);
};

export default CloseRegister;
