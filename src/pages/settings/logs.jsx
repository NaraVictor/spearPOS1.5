import PageTitle from "../../components/page-title";
import
{
	Button,
	PageHeader,
	Space,
	Table,
	Typography,
	Input,
	Select,
	DatePicker,
} from "antd";
import { fetchData, deleteData } from "../../helpers/api";
import { useState, useEffect } from "react";
import
{
	DeleteFilled,
	DeleteOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import { format, isToday, isYesterday } from "date-fns";
import { getRole } from "../../helpers/auth";
import smalltalk from 'smalltalk'
import { openNotification } from "../../helpers/utilities";

const LogsPage = ( props ) =>
{
	const [ logs, setLogs ] = useState( [] );
	const [ filteredData, setFilteredData ] = useState( [] );

	const { Search } = Input;
	const { Option } = Select;
	const { RangePicker } = DatePicker;
	const dateFormat = "MMM DD, yy";

	const fetchLogs = () =>
	{
		fetchData( "logs" ).then( ( res ) =>
		{
			setLogs( res.data.data );
			setFilteredData( res.data.data );
		} );
	};

	// handlers
	const handleResetFilters = () =>
	{
		setFilteredData( logs );
	};

	const handleDeleteLog = ( logId ) =>
	{

		smalltalk.confirm(
			"Delete Log", "Are you sure you want to delete this log?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `logs/${ logId }` ).then( res =>
			{
				if ( res.status === 200 )
				{
					fetchLogs()
					openNotification( 'success', 'log deleted', 'success' )
				}
			} );
		} ).catch( ex =>
		{
			return false
		} )
	};

	const handleClearLogs = ( logId ) =>
	{
		smalltalk.confirm(
			"Clear Logs", "this will erase all logs. continue?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `logs` ).then( res =>
			{
				if ( res.status === 200 )
				{
					fetchLogs()
					openNotification( 'success', 'logs cleared', 'success' )
				}
			} );

		} ).catch( ex =>
		{
			return false
		} )

	};

	const handleDateFilter = ( data ) =>
	{
		const sdate = format( new Date( data[ 0 ]._d ), "yyyy-MM-dd" );
		const edate = format( new Date( data[ 1 ]._d ), "yyyy-MM-dd" );

		setFilteredData(
			filteredData.filter(
				( d ) =>
					format( new Date( d.createdAt ), "yyyy-MM-dd" ) >= sdate &&
					format( new Date( d.createdAt ), "yyyy-MM-dd" ) <= edate
			)
		);
	};

	useEffect( () =>
	{
		fetchLogs();
	}, [] );

	return (
		<div className="content-container">
			<PageTitle title="Logs" />
			<div className="d-flex align-items-center justify-content-between">
				<PageHeader
					ghost={ false }
					title="Application Logs"
					className="site-page-header"
					onBack={ () => window.history.go( -1 ) }
					subTitle="user activity logs in the application"></PageHeader>
				<div className="d-flex">
					<Button
						onClick={ handleResetFilters }
						type="default"
						size="large"
						className="d-flex align-items-center">
						<ReloadOutlined />
						Reset filters
					</Button>
					{ getRole() === "admin" && (
						<Button
							onClick={ handleClearLogs }
							type="default"
							size="large"
							className="d-flex align-items-center bg-danger text-white">
							<DeleteFilled />
							Clear Logs
						</Button>
					) }
				</div>
			</div>
			<div className="d-flex align-items-center bg-white mt-3">
				<div className="d-flex justify-content-between my-3 px-3">
					<Typography>Filter by:</Typography>
					<Space className="ms-3">
						<Search
							onChange={ ( e ) =>
								setFilteredData(
									logs.filter(
										( d ) =>
											d.user.username
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.description
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.department
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.logType
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.user.staff.firstName
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.user.staff.lastName
												.toLowerCase()
												.includes( e.target.value.toLowerCase() )
									)
								)
							}
							placeholder="search all fields (*except date n time)"
							style={ { width: "300px" } }
						/>

						<Select
							style={ { width: "150px" } }
							name="byusername"
							onChange={ ( v ) =>
								setFilteredData(
									filteredData.filter( ( d ) => d.user.username === v )
								)
							}
							defaultValue="username">
							{ [ ...new Set( filteredData.map( ( d ) => d.user.username ) ) ].map(
								( v ) => (
									<Option value={ v } key={ v }>{ v }</Option>
								)
							) }
						</Select>
						<Select
							style={ { width: "150px" } }
							name="bydept"
							onChange={ ( v ) =>
								setFilteredData( filteredData.filter( ( d ) => d.department === v ) )
							}
							defaultValue="department">
							{ [ ...new Set( filteredData.map( ( d ) => d.department ) ) ].map( ( v ) => (
								<Option value={ v } key={ v }>{ v }</Option>
							) ) }
						</Select>
						<Select
							style={ { width: "150px" } }
							name="bytype"
							onChange={ ( v ) =>
								setFilteredData( filteredData.filter( ( d ) => d.logType === v ) )
							}
							defaultValue="log type">
							{ [ ...new Set( filteredData.map( ( d ) => d.logType ) ) ].map( ( v ) => (
								<Option value={ v } key={ v }>{ v }</Option>
							) ) }
						</Select>
						<RangePicker
							name="date-range"
							format={ dateFormat }
							onChange={ ( e ) => handleDateFilter( e ) }
						/>
					</Space>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<Table
						columns={ [
							{
								title: "Log Date",
								key: "logDate",
								sorter: ( a, b ) =>
									new Date( a.createdAt.split( "T" )[ 0 ] ) >
									new Date( b.createdAt.split( "T" )[ 0 ] ),
								sortDirections: [ "descend", "ascend" ],
								render: ( text, record, index ) =>
								{
									return isToday( new Date( record.createdAt.split( "T" )[ 0 ] ) )
										? "Today"
										: isYesterday( new Date( record.createdAt.split( "T" )[ 0 ] ) )
											? "Yesterday"
											: format(
												new Date( record.createdAt.split( "T" )[ 0 ] ),
												"EEE MMM dd, yyyy"
											);
								},
							},
							{
								title: "Log Time",
								render: ( text, record, index ) =>
								{
									return new Date( record.createdAt ).toLocaleTimeString();
								},
							},
							{
								title: "Staff",
								render: ( text, record, index ) =>
									`${ record.user.staff.firstName } ${ record.user.staff.lastName }`,
							},
							{
								title: "Username",
								render: ( text, record, index ) => `${ record.user.username }`,
							},
							{
								title: "Activity Description",
								dataIndex: "description",
							},
							{
								title: "Department",
								dataIndex: "department",
							},
							{
								title: "Type",
								dataIndex: "logType",
							},

							{
								title: "",
								render: ( text, record, index ) => (
									<Button
										title="delete log"
										onClick={ () => handleDeleteLog( record.id ) }
										className="d-flex align-items-center text-danger">
										<DeleteOutlined />
									</Button>
								),
							},
						] }
						rowKey={ ( record ) => record.id }
						dataSource={ filteredData }
					/>
				</div>
			</div>
		</div>
	);
};

export { LogsPage };
