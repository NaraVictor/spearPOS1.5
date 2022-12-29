import { Button, Space, Table, Input, DatePicker, Spin } from "antd";
import { fetchData } from "../../helpers/api";
import { useState, useEffect } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { format, isToday, isYesterday } from "date-fns";

const UserLogs = ( { userId } ) =>
{
	const [ logs, setLogs ] = useState( [] );
	const [ filteredData, setFilteredData ] = useState( [] );

	const { Search } = Input;
	const { RangePicker } = DatePicker;
	const dateFormat = "MMM DD, yy";

	const fetchLogs = () =>
	{
		fetchData( "logs/" + userId ).then( ( res ) =>
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
	}, [ userId ] );

	return (
		<div className="content-container">
			<Button
				onClick={ handleResetFilters }
				type="default"
				size="large"
				className="d-flex align-items-center">
				<ReloadOutlined />
				Reset filters
			</Button>
			<div className="d-flex align-items-center bg-white">
				<div className="d-flex justify-content-between my-3 ">
					<Space className="">
						<Search
							onChange={ ( e ) =>
								setFilteredData(
									logs.filter(
										( d ) =>
											d.description
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.department
												.toLowerCase()
												.includes( e.target.value.toLowerCase() ) ||
											d.logType
												.toLowerCase()
												.includes( e.target.value.toLowerCase() )
									)
								)
							}
							placeholder="search records"
							style={ { width: "200px" } }
						/>

						{/* <Select
							style={{ width: "150px" }}
							name="bydept"
							onChange={(v) =>
								setFilteredData(filteredData.filter((d) => d.department === v))
							}
							defaultValue="department">
							{[...new Set(filteredData.map((d) => d.department))].map((v) => (
								<Option value={v}>{v}</Option>
							))}
						</Select>
						<Select
							style={{ width: "150px" }}
							name="bytype"
							onChange={(v) =>
								setFilteredData(filteredData.filter((d) => d.logType === v))
							}
							defaultValue="log type">
							{[...new Set(filteredData.map((d) => d.logType))].map((v) => (
								<Option value={v}>{v}</Option>
							))}
						</Select> */}
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
					{ filteredData.length === 0 ? (
						<>
							<Spin
							// indicator={() => <LoadingOutlined style={{ fontSize: 24 }} spin />}
							/>{ " " }
							<span className="ms-2">loading...</span>
						</>
					) : (
						<>
							<p>
								<strong>{ filteredData.length }</strong> records
							</p>
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
											return new Date( record.createdAt.split( "T" )[ 1 ] );
										},
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

									// {
									// 	title: "",
									// 	render: (text, record, index) => (
									// 		<Button
									// 			title="delete log"
									// 			onClick={() => handleDeleteLog(record.id)}
									// 			className="d-flex align-items-center text-danger">
									// 			<DeleteOutlined />
									// 		</Button>
									// 	),
									// },
								] }
								rowKey={ ( record ) => record.id }
								dataSource={ filteredData }
							/>
						</>
					) }
				</div>
			</div>
		</div>
	);
};

export { UserLogs };
