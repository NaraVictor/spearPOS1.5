import { useState, useEffect } from "react";
import { fetchData, updateData } from "../helpers/api";
import { Button, Input, Select } from "antd";
import { extractInputData } from "./../helpers/utilities";

const ExpenseEdit = ( { data, onReload } ) =>
{
	const [ categories, setCategories ] = useState( [] );
	const [ status, setStatus ] = useState( {
		success: false,
		err: false,
		errMsg: "",
		successMsg: "",
	} );
	const [ busy, setBusy ] = useState( false );
	const [ record, setRecord ] = useState( {} );

	const { Option } = Select;

	useEffect( () =>
	{
		fetchCategories();
		setRecord( {
			id: data.id,
			description: data.description,
			amount: data.amount,
			date: data.date,
			categoryId: data.categoryId,
		} );
	}, [ data ] );

	//handlers
	const handleRecordChange = ( e, fieldName = "", isValueOnly = false ) =>
	{
		if ( isValueOnly )
		{
			//mostly drop drop -> ant design just gives only the value
			setRecord( {
				...record,
				[ fieldName ]: e,
			} );
			return;
		}

		const { name, value } = e.target;
		setRecord( {
			...record,
			[ name ]: value,
		} );
	};

	const fetchCategories = () =>
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
	};

	const updateExpense = ( e ) =>
	{
		const data = extractInputData( e );

		setBusy( true );
		updateData( "expenses", {
			...data,
			id: record.id,
			categoryId: record.categoryId,
		} )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStatus( {
						success: true,
						successMsg: "Expense updated successfully",
					} );
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
			<form onSubmit={ ( e ) => updateExpense( e ) }>
				<div className="row">
					<div className="col-12">
						<div>
							<label htmlFor="description">Description *</label>
							<Input
								type="text"
								autoFocus
								className="form-control"
								placeholder="describe expenditure"
								name="description"
								required
								value={ record.description }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div className="my-3">
							<label htmlFor="amount">Amount *</label>
							<Input
								type="number"
								step="0.01"
								min="0"
								name="amount"
								required
								className="form-control"
								placeholder="input amount spent"
								value={ record.amount }
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>
						<div>
							<label htmlFor="categories">Category *</label>
							<Select
								name="categoryId"
								id="categories"
								required
								className="custom-select form-control"
								value={ record.categoryId }
								onChange={ ( e ) => handleRecordChange( e, "categoryId", true ) }>
								<Option selected value="">
									select a category
								</Option>
								{ categories.length > 0 &&
									categories.map( ( cat ) => (
										<Option value={ cat.id } key={ cat.id }>
											{ cat.name }
										</Option>
									) ) }
							</Select>
						</div>
						<div className="my-3">
							<label htmlFor="date">Date *</label>
							<Input
								type="date"
								name="date"
								className="form-control"
								placeholder="input date spent"
								value={ record.date }
								required
								onChange={ ( e ) => handleRecordChange( e ) }
							/>
						</div>

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
				<button id="submitter" hidden type="submit"></button>
			</form>
			<Button
				onClick={ () =>
				{
					document.getElementById( "submitter" ).click();
				} }
				type="primary"
				loading={ busy ? true : false }
				className="btn btn-primary">
				{ busy ? "Updating..." : "Update Expense" }
			</Button>
		</div>
	);
};

export default ExpenseEdit;
