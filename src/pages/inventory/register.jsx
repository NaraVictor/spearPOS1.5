import PageTitle from "../../components/page-title";
import { useState, useEffect } from "react";
import { PageHeader, Modal, Button, Table, Space, Tag } from "antd";
import { DeleteOutlined, FolderOpenOutlined, KeyOutlined, LockOutlined, } from "@ant-design/icons";
import OpenRegister from "../../components/register-open";
import { deleteData, fetchData } from "../../helpers/api";
import { cedisLocale, isRegisterOpen, openNotification, resetRegister } from "../../helpers/utilities";
import CloseRegister from "../../components/register-close";
import RegisterDetail from "../../components/register-detail";
import { getRole } from "../../helpers/auth";
import smalltalk from 'smalltalk'


// 
const RegisterPage = ( props ) => {
	const [ registers, setRegisters ] = useState( [] );
	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );

	const showModal = ( title, content, width ) => {
		setModal( {
			content,
			title,
			isVisible: true,
			width,
		} );
	};

	const handleCancel = () => {
		setModal( {
			...modal,
			isVisible: false,
		} );
	};

	const fetchRegisters = () => {
		fetchData( "registers" ).then( ( res ) => {
			if ( res.status === 200 ) {
				setRegisters( () => res.data.data );
			}
		} );
	};

	const deleteRegister = ( id ) => {
		smalltalk.confirm(
			"Delete Register", "Are you sure of deleting this register? Can't be undone!", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok => {
			deleteData( `registers/${ id }` ).then( ( res ) => {
				if ( res.status === 200 ) {
					openNotification( "success", "register successfully deleted", 'success' )
					fetchRegisters();
					resetRegister( id ); //clear local storage state
				}
			} );
		} ).catch( ex => {
			return false
		} )
	};

	useEffect( () => {
		fetchRegisters();
	}, [] );

	const columns = [
		{
			title: "Sequence",
			sorter: ( a, b ) => a.sequence > b.sequence,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => `#${ record.sequence }`,
		},
		{
			title: "Open Time",
			sorter: ( a, b ) => a.openTime > b.openTime,
			sortDirections: [ "descend", "ascend" ],
			render: ( t, r, i ) => !r.openTime ? "-" : new Date( r.openTime ).toUTCString(),

		},
		{
			title: "Close Time",
			sorter: ( a, b ) => a.closeTime > b.closeTime,
			sortDirections: [ "descend", "ascend" ],
			render: ( t, r, i ) => !r.closeTime ? "-" : new Date( r.closeTime ).toUTCString(),
		},
		{
			title: "Opening Float",
			sorter: ( a, b ) => a.openingFloat > b.openingFloat,
			sortDirections: [ "descend", "ascend" ],
			render: ( t, r, i ) => cedisLocale.format( r.openingFloat ),

		},
		// {
		// 	title: "Difference",
		// 	sorter: ( a, b ) => a.difference - b.difference,
		// 	sortDirections: [ "descend", "ascend" ],
		// 	render: ( t, r, i ) => cedisLocale.format( 0 ),

		// },
		{
			title: "Status",
			sorter: ( a, b ) => a.isClosed - b.isClosed,
			sortDirections: [ "descend", "ascend" ],
			render: ( t, r, i ) => r.isClosed ?
				<Tag color="geekblue">closed</Tag>
				: <Tag color="error">open</Tag>,

		},

		{
			title: "Action",
			render: ( text, record, index ) => (
				<Space>
					<Button
						onClick={ () =>
							showModal(
								`Register Details`,
								<RegisterDetail data={ record } />,
							)
						}
						title="edit record"
						className="d-flex align-items-center">
						<FolderOpenOutlined />
						{/* Edit */ }
					</Button>
					{
						getRole() === "admin" && <Button
							title="delete record"
							onClick={ () => deleteRegister( record.id ) }>
							<DeleteOutlined className="text-danger" />
						</Button >
					}
				</Space >
			),
		},
	];

	return (
		<div className="content-container">
			<PageTitle title="Register" />

			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				zIndex="90"
				onCancel={ handleCancel }
				footer={ null }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>

			<div className="bg-white shadow-sm p-3">
				<div className="d-flex align-items-center justify-content-between my-4">
					<PageHeader
						ghost={ false }
						title="Register"
						className="site-page-header"
						onBack={ () => window.history.go( -1 ) }
						subTitle="mark the end and beginning of each business day"></PageHeader>
					{
						getRole() !== 'attendant' && <div className="d-flex">
							{/* 
							<Button onClick={ () => {
								smalltalk.confirm(
									"Reset Register", 'Only use this feature after deleting an open register. Proceed?', {
									buttons: {
										ok: 'YES',
										cancel: 'NO',
									},
								}
								).then( ok => {
									resetRegister()
								} ).catch( ex => {
									return false
								} )

							} }>
								Clear State
							</Button> */}

							<Button
								type="primary"
								size="large"
								className="d-flex align-items-center ms-2"
								onClick={ () => {
									if ( isRegisterOpen() ) {
										showModal( "Close Register", <CloseRegister onReload={ () => {
											fetchRegisters()
											handleCancel()
											openNotification( "success", 'register successfully closed', 'success' )

										} } /> )
									} else {
										showModal( "Open Register", <OpenRegister onReload={ () => {
											fetchRegisters()
											handleCancel()
											openNotification( "success", 'register successfully opened', 'success' )
										} } /> )
									}
								} }>
								{
									isRegisterOpen() ? <LockOutlined /> : <KeyOutlined />
								}
								{ isRegisterOpen() ? "Close " : "Open " } Register
							</Button>
						</div>
					}
				</div>
				<div className="row">
					<div className="col-12">
						<Table
							rowKey={ ( record ) => record.id }
							onRow={ ( record, rowIndex ) => {
								return {
									onClick: ( event ) => { },
								};
							} }
							dataSource={ registers }
							columns={ columns }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export { RegisterPage };
