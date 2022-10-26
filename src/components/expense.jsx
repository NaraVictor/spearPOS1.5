import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Spinner1 } from "../components/spinner";
import { postData, fetchData } from "./../helpers/api";

const ExpenseForm = ( { onReload } ) =>
{
	const [ categories, setCategories ] = useState( [] );
	const { handleSubmit, register, reset } = useForm();
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );

	useEffect( () =>
	{
		fetchData( "categories?type=expense" )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setCategories( () => res.data.data );
				}
			} )
			.catch( ( ex ) => console.log( ex ) );
	}, [] );

	const submitExpense = ( data ) =>
	{
		setBusy( true );
		postData( "expenses", data )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Expense added successfully",
					} );
					reset();
					onReload();
				}
				if ( res.status === 400 )
				{
					setStatus( {
						err: true,
						errMsg:
							"There was an error. Please ensure 'amount' and 'description' are provided",
					} );
					// reset();
				}
			} )
			.catch( ( ex ) =>
			{
				setStatus( {
					err: true,
					errMsg: "Sorry, an error occurred",
				} );
				reset();
			} )
			.finally( ( f ) =>
			{
				setBusy( false );
				setTimeout( () =>
				{
					setStatus( {
						err: false,
						success: false,
					} );
				}, 5000 );
			} );
	};

	return (
		<div className="expense-box">
			<form onSubmit={ handleSubmit( submitExpense ) }>
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
								<label htmlFor="description">Description</label>
								<input
									type="text"
									autoFocus
									className="form-control"
									placeholder="describe expenditure"
									{ ...register( "description", { required: true } ) }
								/>
							</div>
							<div className="my-3">
								<label htmlFor="amount">Amount</label>
								<input
									type="number"
									step="0.01"
									min="0"
									className="form-control"
									placeholder="input amount spent"
									{ ...register( "amount", { required: true } ) }
								/>
							</div>
							<div>
								<label htmlFor="categories">Category</label>
								<select
									name="categories"
									id="categories"
									className="custom-select form-control"
									{ ...register( "categoryId", { required: true } ) }>
									<option selected value="">
										select a category
									</option>
									{ categories.length > 0 &&
										categories.map( ( cat ) => (
											<option value={ cat.id }>{ cat.name }</option>
										) ) }
								</select>
							</div>
							<div className="my-3">
								<label htmlFor="date">Date</label>
								<input
									type="date"
									className="form-control"
									placeholder="input date spent"
									{ ...register( "date", { required: true } ) }
								/>
							</div>
							<button className="btn btn-primary" type="submit">
								Add Expense
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
						</div>
					</div>
				) }
			</form>
		</div>
	);
};

export default ExpenseForm;
