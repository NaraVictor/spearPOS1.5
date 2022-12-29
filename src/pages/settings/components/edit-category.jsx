import React, { useState, useEffect } from "react";
import { updateData } from "../../../helpers/api";
import { Alert, Button, Select } from "antd";
import { Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

//
const EditCategory = ( { category, onReload } ) =>
{
	const [ error, setError ] = useState( false );
	const [ busy, setBusy ] = useState( false );
	const [ success, setSuccess ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "An error has ocurred!" );
	const [ record, setRecord ] = useState( {} );

	const { Option } = Select;

	const handleRecordChange = ( e ) =>
	{
		const { name, value } = e.target;
		setRecord( {
			...record,
			[ name ]: value,
		} );
	};

	const handleSelectChange = ( value, inputName ) =>
	{
		setRecord( {
			...record,
			[ inputName ]: value,
		} );
	};

	const onUpdate = async ( e ) =>
	{
		try
		{
			e.preventDefault();

			setError( false );
			setBusy( true );

			const category = await updateData( "categories", record );

			if ( category.status === 200 )
			{
				onReload();
				setSuccess( true );
				setBusy( false );
				return;
			}

			setError( true );
			setBusy( false );
			setErrMsg( "Request could not be completed." );
		} catch ( ex )
		{
			if ( ex.response.status === 409 )
			{
				setError( true );
				setErrMsg( "Category already exist" );
				return;
			}

			setBusy( false );
			setError( true );
		}
	};

	useEffect( () =>
	{
		setRecord( {
			id: category.id,
			name: category.name,
			type: category.type,
			description: category.description,
		} );
	}, [ category ] );

	return (
		<div className="auth">
			<div className="outer pb-3">
				{ error && (
					<Alert type="error" message={ errMsg } closable className="mb-2" />
				) }

				<form onSubmit={ ( e ) => onUpdate( e ) }>
					<div className="row">
						<div className="col-12">
							<Select
								id="type"
								required
								name="type"
								value={ record.type }
								onChange={ ( v ) => handleSelectChange( v, "type" ) }
								className="custom-select form-control">
								<Option defaultValue value="">
									select type
								</Option>
								<Option value="product">Products</Option>
								<Option value="expense">Expenses</Option>
							</Select>
						</div>
						<div className="col-12 my-2">
							<Input
								type="text"
								placeholder="category name"
								className="form-control"
								name="name"
								required
								value={ record.name }
								onChange={ ( v ) => handleRecordChange( v ) }
							/>
						</div>
						<div className="col-12 mb-2">
							<TextArea
								type="description"
								name="description"
								value={ record.description }
								onChange={ ( v ) => handleRecordChange( v ) }
								placeholder="category description"
								className="form-control"></TextArea>
						</div>
					</div>
					<button id="submitter" hidden type="submit"></button>
				</form>
				<Button
					type="primary"
					size="large"
					loading={ busy ? true : false }
					className="my-2"
					onClick={ () =>
					{
						document.getElementById( "submitter" ).click();
					} }>
					{ busy ? "updating..." : "Update" }
				</Button>
				{ success && (
					<Alert
						type="success"
						message="Category information successfully updated!"
						showIcon
						closable
						className="mt-2"
					/>
				) }
			</div>
		</div>
	);
};

export default EditCategory;
