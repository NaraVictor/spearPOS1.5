import { InfoCircleTwoTone, SaveOutlined } from "@ant-design/icons";
import { Alert, Button, Divider, Input, Switch, Select, Tooltip } from "antd";
import PageTitle from "../../components/page-title";
import { useState } from "react";
import { useEffect } from "react";
import { fetchData, updateData } from "../../helpers/api";
import { getRole } from "../../helpers/auth";

const GeneralSettings = ( props ) =>
{
	const [ categories, setCategories ] = useState( [] );
	const [ settings, setSettings ] = useState( {} );
	const [ success, setSuccess ] = useState( false );
	const [ error, setError ] = useState( false );
	const { Option } = Select;

	//handlers
	const handleRecordChange = ( e, fieldName = "", isValueOnly = false ) =>
	{
		if ( isValueOnly )
		{
			//mostly drop drop -> ant design just gives only the value
			setSettings( {
				...settings,
				[ fieldName ]: e,
			} );
			return;
		}
		const { name, value } = e.target;
		setSettings( {
			...settings,
			[ name ]: value,
		} );
	};

	const fetchCategories = () =>
	{
		fetchData( "categories?type=expense" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setCategories( res.data.data );
			}
		} );
	};

	const fetchSettings = () =>
	{
		fetchData( "settings" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setSettings( {
					...settings,
					...res.data.data,
				} );
			}
		} );
	};

	const updateSettings = () =>
	{
		updateData( "settings", settings ).then( ( res ) =>
			res.status === 200 ? setSuccess( true ) : setError( true )
		);
	};

	useEffect( () =>
	{
		fetchCategories();
		fetchSettings();
	}, [] );

	return (
		<div className="bg-white content-container">
			<PageTitle title="General Settings" />
			<div className="d-flex justify-content-between p-5">
				<h5>General</h5>
				{ getRole() === "admin" && (
					<Button
						type="primary"
						size="large"
						className="d-flex align-items-center"
						onClick={ updateSettings }>
						<SaveOutlined />
						Save Settings
					</Button>
				) }
			</div>
			{ success && (
				<Alert message="settings saved" type="success" showIcon closable />
			) }

			{ error && (
				<Alert message="settings not saved" type="error" showIcon closable />
			) }
			<Divider className="mt-0" />
			<div className="row px-5">
				<div className="col-3 ">
					<span className="d-flex align-items-center">
						Receipt Prefix Abbreviations
						<Tooltip
							title="a three letter (abbreviations) added to receipt number"
							className="ms-2">
							<InfoCircleTwoTone />
						</Tooltip>
					</span>
				</div>

				<div className="col-8">
					<Input
						maxLength={ 3 }
						minLength={ 3 }
						placeholder="3 letter abbreviation e.g. ABC"
						name="receiptAbbreviation"
						value={ settings.receiptAbbreviation }
						onChange={ ( v ) => handleRecordChange( v ) }
					/>
				</div>
				<Divider className="my-3" />
				<div className="col-3 ">
					<span className="d-flex align-items-center">
						Purchase Expenditure Category
						<Tooltip
							title="a preferred category for purchase of goods expenses"
							className="ms-2">
							<InfoCircleTwoTone />
						</Tooltip>
					</span>
				</div>
				<div className="col-8">
					<Select
						id="purchaseExpenseCategoryId"
						name="purchaseExpenseCategoryId"
						className="custom-select form-control"
						value={ settings.purchaseCategory }
						onChange={ ( v ) =>
						{
							handleRecordChange( v, "purchaseCategory", true );
						} }>
						{ categories.length > 0 &&
							categories.map( ( cat ) => (
								<Option value={ `${ cat.name }` } key={ cat.id }>
									{ cat.name }
								</Option>
							) ) }
					</Select>
				</div>
				<Divider className="my-3" />
				<div className="col-3 ">
					<span className="d-flex align-items-center">
						Record restocking as an expense?
						<Tooltip
							title="should spearPOS automatically record restocking of products as an expense?"
							className="ms-2">
							<InfoCircleTwoTone />
						</Tooltip>
					</span>
				</div>
				<div className="col-8">
					<Switch checked={ settings.addRestockExpense } value={ settings.addRestockExpense } onChange={ ( v ) => handleRecordChange( v, "addRestockExpense", true ) } />
					<strong className="ms-2">
						{ settings.addRestockExpense ? <>Yes</> : <>No</> }
					</strong>
				</div>
				{/* <Divider className="my-3" /> */ }
			</div>
		</div>
	);
};

export default GeneralSettings;
