import
{
	Divider,
	Space,
	Button,
	Typography,
	Select,
	DatePicker,
	Table,
	Input,
} from "antd";
import { useState, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { cedisLocale } from "../../../../helpers/utilities";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import ExportToExcelButton from "./../../../../components/export-to-excel-btn";

const FilteredExpenses = ( { dataSource, dataSize } ) =>
{
	const [ filteredData, setFilteredData ] = useState( [] );
	const [ pagination, setPagination ] = useState( {
		current: 1,
		pageSize: 10,
	} );
	const [ exp, setExp ] = useState( 0 );

	// variables
	const { Text } = Typography;
	const { Search } = Input;
	const { Option } = Select;
	const { RangePicker } = DatePicker;
	const dateFormat = "MMM DD, yy";

	// handlers
	const handleResetFilters = () =>
	{
		setFilteredData( dataSource );
	};

	const handleDateFilter = ( data ) =>
	{
		try
		{
			const sdate = format( new Date( data[ 0 ]._d ), "yyyy-MM-dd" );
			const edate = format( new Date( data[ 1 ]._d ), "yyyy-MM-dd" );

			setFilteredData(
				filteredData.filter( ( d ) => d.date >= sdate && d.date <= edate )
			);
		} catch ( ex )
		{
			console.log( ex );
		}
	};

	const handleTableChange = ( e ) =>
	{
		setPagination( {
			...e,
		} );
	};

	//
	useEffect( () =>
	{
		setFilteredData( dataSource );
		setPagination( {
			...pagination,
			total: dataSize > 80 ? dataSize : 100,
		} );
	}, [ dataSource ] );

	useEffect( () =>
	{
		let sum = 0;
		filteredData.map( ( d ) => ( sum += parseFloat( d.amount || 0 ) ) );
		setExp( sum );
	}, [ filteredData ] );

	// sales audit table
	const columns = [
		{
			title: "#",
			render: ( text, record, index ) => ++index,
			width: "80px",
		},

		{
			title: "Date",
			sorter: ( a, b ) => a.date > b.date,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return isToday( new Date( record.date ) )
					? "Today"
					: isYesterday( new Date( record.date ) )
						? "Yesterday"
						: format( new Date( record.date ), "EEE MMM d, yy" );
			},
		},
		{
			title: "Staff",
			sorter: ( a, b ) =>
				a.user.staff.firstName.length > b.user.staff.firstName.length,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
				`${ record.user.staff.firstName } ${ record.user.staff.lastName }`,
		},
		{
			title: "Amount",
			sorter: ( a, b ) => a.amount - b.amount,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => cedisLocale.format( record.amount ),
		},
		{
			title: "Category",
			sorter: ( a, b ) => a.category.name.length - b.category.name.length,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => record.category.name,
		},
		{
			title: "Description",
			dataIndex: "description",
		},
	];

	return (
		<>
			<div className="d-flex align-items-center">
				<Typography>
					<Text>Filter by:</Text>
				</Typography>
				<div className="d-flex justify-content-between ">
					<Space className="ms-3">
						<Search
							onChange={ ( e ) =>
								setFilteredData(
									dataSource.filter(
										( d ) =>
											d.amount === e.target.value ||
											d.description
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.date
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.category.name
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											`${ d.user.staff.firstName } ${ d.user.staff.firstName }`
												.toLowerCase()
												.includes( e.target.value.toLowerCase() )
									)
								)
							}
							placeholder="search all"
							style={ { width: "200px" } }
						/>

						<Select
							style={ { width: "150px" } }
							name="byproduct"
							onChange={ ( v ) =>
								setFilteredData(
									filteredData.filter( ( d ) => d.user.staff.firstName === v )
								)
							}
							defaultValue="staff">
							{ [
								...new Set( filteredData.map( ( d ) => d.user.staff.firstName ) ),
							].map( ( v ) => (
								<Option value={ v } key={ v }>{ v }</Option>
							) ) }
						</Select>
						<Select
							style={ { width: "150px" } }
							name="byproductcategory"
							onChange={ ( v ) =>
								setFilteredData(
									filteredData.filter( ( d ) => d.category.name === v )
								)
							}
							defaultValue="category">
							{ [ ...new Set( filteredData.map( ( d ) => d.category.name ) ) ].map(
								( v ) => (
									<Option value={ v } key={ v }>{ v }</Option>
								)
							) }
						</Select>
						<RangePicker
							name="date-range"
							format={ dateFormat }
							onChange={ ( e ) => handleDateFilter( e ) }
						/>
					</Space>
					<Button
						onClick={ handleResetFilters }
						type="primary"
						className="mx-3 d-flex align-items-center rounded">
						<ReloadOutlined />
						Reset filters
					</Button>
					<ExportToExcelButton
						tableId="filtered-expenses-table"
						fileName="spearPOS expenses"
						workSheetName="expenses_sheet"
					/>
				</div>
			</div>
			<Divider />

			<Typography className="ms-2 mb-2">
				<Text>
					<Space>
						<strong>{ dataSource.length }</strong>
						records
						<strong className="ms-3 text-danger">
							{ cedisLocale.format( exp ) }
						</strong>
						total expenses
						{ filteredData.length !== dataSource.length && (
							<div className="d-flex align-items-center ms-5">
								<FilterOutlined />
								<strong className="me-2">{ filteredData.length }</strong> filtered
								results
							</div>
						) }
					</Space>
				</Text>
			</Typography>
			<div className="audit-data">
				<Table
					id="filtered-expenses-table"
					columns={ columns }
					dataSource={ filteredData }
					rowKey={ ( record ) => record.id }
					sticky
					pagination={ pagination }
					onChange={ handleTableChange }
				/>
			</div>
		</>
	);
};

export default FilteredExpenses;
