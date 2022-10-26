import PageTitle from "../../components/page-title";
import { useState, useEffect } from "react";
import { fetchData, deleteData } from "../../helpers/api";
import StaffForm from "./../../components/staff";
import StaffDetail from "../../components/staff-detail";
import { PageHeader, Button, Modal, Table, Space } from "antd";
import StaffEdit from "./../../components/staff-edit";
import
{
	DeleteOutlined,
	EditOutlined,
	FolderOpenTwoTone,
	PlusOutlined,
} from "@ant-design/icons";
import { getRole } from "../../helpers/auth";
import smalltalk from 'smalltalk'
import { openNotification } from "../../helpers/utilities";

const StaffsPage = ( props ) =>
{
	const [ staffs, setStaff ] = useState( [] );
	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );

	const showModal = ( title, content, width ) =>
	{
		setModal( {
			content,
			title,
			isVisible: true,
			width,
		} );
	};

	const handleCancel = () =>
	{
		setModal( {
			...modal,
			isVisible: false,
		} );
	};

	const fetchStaffs = () =>
	{
		fetchData( "staffs" )
			.then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					setStaff( () => res.data.data );
				}
			} )
			.catch( ( ex ) => console.log( ex ) );
	};

	const deleteStaff = ( id ) =>
	{

		smalltalk.confirm(
			"Delete Staff", "deleting a staff will delete their corresponding user information. continue?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `staffs/${ id }` ).then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					openNotification( 'success', "staff successfully deleted", 'success' );
					fetchStaffs();
				}
			} );
		} ).catch( ex =>
		{
			return false
		} )
	};

	useEffect( () =>
	{
		fetchStaffs();
	}, [] );

	const columns = [
		{
			title: "#",
			sorter: ( a, b ) => a.index > b.index,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => ++index,
		},
		{
			title: "Name",
			// sorter: (a, b) => new Date(a.saleDate) > new Date(b.saleDate),
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return `${ record.firstName } ${ record.lastName }`;
			},
		},
		{
			title: "Gender",
			dataIndex: "gender",
			sorter: ( a, b ) => a.gender - b.gender,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Position",
			dataIndex: "position",
			sorter: ( a, b ) => a.position - b.position,
			sortDirections: [ "descend", "ascend" ],
		},
		// {
		// 	title: "Type",
		// 	dataIndex: "staffType",
		// 	sorter: (a, b) => a.staffType - b.staffType,
		// 	sortDirections: ["descend", "ascend"],
		// },
		{
			title: "Contact",
			dataIndex: "contact",
			sorter: ( a, b ) => a.contact - b.contact,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Action",
			render: ( text, record, index ) => (
				<Space>
					<Button
						title="view record details"
						className="d-flex align-items-center"
						onClick={ () =>
							showModal(
								`${ record.firstName } ${ record.lastName }`,
								<StaffDetail staff={ record } />
							)
						}>
						<FolderOpenTwoTone />
						View
					</Button>
					{
						getRole() === ( "admin" || "manager" ) &&
						<Button
							onClick={ () =>
								showModal(
									`Editing: ${ record.firstName } ${ record.lastName }`,
									<StaffEdit staff={ record } onReload={ fetchStaffs } />
								)
							}
							title="edit record"
							className="d-flex align-items-center">
							<EditOutlined />
							{/* Edit */ }
						</Button>
					}
					{ getRole() === "admin" && (
						<Button
							title="delete record"
							onClick={ () => deleteStaff( record.id ) }>
							<DeleteOutlined className="text-danger" />
						</Button>
					) }
				</Space>
			),
		},
	];

	return (
		<div className="content-container">
			<PageTitle title="Staffs" />
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				onCancel={ handleCancel }
				footer={ null }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>

			<div className="row">
				<div className="col-9 mx-auto">
					<div className="d-flex align-items-center justify-content-between my-4">
						<PageHeader
							ghost={ false }
							title="Staffs"
							className="site-page-header"
							onBack={ () => window.history.go( -1 ) }
							subTitle="all staffs working in the business"></PageHeader>
						<Button
							type="primary"
							size="large"
							className="d-flex align-items-center"
							onClick={ () =>
								showModal( "New Staff", <StaffForm onAdd={ fetchStaffs } /> )
							}>
							<PlusOutlined />
							New Staff
						</Button>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col-md-9 mx-auto">
					<div className="shadow-sm bg-white p-2 mt-3">
						<p>
							<strong>{ staffs.length }</strong> staffs
						</p>
						<Table columns={ columns } dataSource={ staffs }
							rowKey={ ( record ) => record.id }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export { StaffsPage };
