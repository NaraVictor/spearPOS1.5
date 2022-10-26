import { SendOutlined } from "@ant-design/icons";
import { Alert, Button, Input } from "antd";
import { postData } from "../../helpers/api";
import { useState, useEffect } from "react";
import { cedisLocale, extractInputData } from "./../../helpers/utilities";
import smalltalk from 'smalltalk'

const AddPayment = ( { sale, onReload } ) =>
{
	const [ amount, setAmount ] = useState( 0 );
	const [ success, setSuccess ] = useState( false );
	const [ error, setError ] = useState( {
		state: false,
		msg: "",
	} );

	const [ busy, setBusy ] = useState( false );

	const { sumAmt, amountPaid, discount, id } = sale;
	const handlePayment = ( e ) =>
	{
		const data = extractInputData( e );
		setError( {
			state: false,
			msg: "",
		} );

		smalltalk.confirm(
			"Confirmation", "proceed to adding payment?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{



			setBusy( true );

			// validations
			if ( parseFloat( amountPaid ) + parseFloat( amount ) > ( parseFloat( sumAmt ) - parseFloat( discount || 0 ) ) )
			{
				setError( {
					state: true,
					msg: "total payments will exceed total due.",
				} );
				setBusy( false );
				return;
			}

			if ( amount === 0 )
			{
				setError( {
					state: true,
					msg: "amount cannot be zero",
				} );
				setBusy( false );
				return;
			}

			// posting...
			postData( `sales/${ id }/payments`, {
				...data,
				saleId: id,
			} ).then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setAmount( 0 );
					setSuccess( true );
					onReload();
				}
			} );

			setBusy( false );

		} ).catch( ex =>
		{
			setError( {
				state: true,
				msg: "payment cancelled",
			} );
			return false
		} )
	};

	useEffect( () =>
	{
		setAmount( 0 );
	}, [ sale ] );

	return (
		<>
			<form onSubmit={ handlePayment }>
				<div className="d-flex">
					<span>
						<strong>Total Due: </strong> { sumAmt }
					</span>
					<span className="mx-3">
						<strong>Total Payments: </strong> { amountPaid }
					</span>
					<span>
						<strong>Discount Given: </strong> { discount }
					</span>
				</div>
				<div
					className={ `my-3 ${ parseFloat( amountPaid ) + parseFloat( amount ) > ( parseFloat( sumAmt ) - parseFloat( discount ) )
						? "text-danger"
						: "text-success"
						}` }>
					Expected Total Payments:{ " " }
					<strong>
						{ cedisLocale.format( parseFloat( amount ) + parseFloat( amountPaid ) ) }
					</strong>
				</div>
				<div className="mb-3">
					<label htmlFor="amount">Amount</label>
					<Input
						placeholder="amount paid"
						type="number"
						value={ amount }
						onChange={ ( e ) => setAmount( () => e.target.value ) }
						id="amount"
						name="amount"
					/>
				</div>

				{ success && (
					<Alert
						type="success"
						message="payment successfully added"
						closable
						showIcon
					/>
				) }
				{ error.state && (
					<Alert type="error" message={ error.msg } closable showIcon />
				) }
				<input type="submit" value="" id="submitter" hidden />
			</form>
			<Button
				type="primary"
				size="large"
				loading={ busy ? true : false }
				className="d-flex align-items-center mt-3"
				onClick={ () => document.getElementById( "submitter" ).click() }>
				<SendOutlined />
				Pay
			</Button>
		</>
	);
};

export default AddPayment;
