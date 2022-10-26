import PageTitle from "../../components/page-title";
import { useState, useEffect } from "react";
import { PageHeader, Modal, Button, Table, Space } from "antd";
import { DeleteOutlined, EditOutlined, FolderOpenOutlined, PlusOutlined } from "@ant-design/icons";
import SupplierForm from "./../../components/supplier";
import SupplierEdit from "./../../components/supplier-edit";
import { deleteData, fetchData } from "./../../helpers/api";
import SupplierDetail from "../../components/supplier-detail";
import { getRole } from "../../helpers/auth";
import smalltalk from 'smalltalk'
import { openNotification } from "../../helpers/utilities";


const SuppliersPage = ( props ) =>
{
	const [ suppliers, setSuppliers ] = useState( [] );
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

	const fetchSuppliers = () =>
	{
		fetchData( "suppliers" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setSuppliers( () => res.data.data );
			}
		} );
	};

	const deleteSupplier = ( id ) =>
	{

		smalltalk.confirm(
			"Delete Supplier", "Are you sure of deleting this supplier? Can't be undone!", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `suppliers/${ id }` ).then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					openNotification( 'success', "supplier successfully deleted", 'success' );
					fetchSuppliers();
				}
			} );
		} ).catch( ex =>
		{
			return false
		} )
	};

	useEffect( () =>
	{
		fetchSuppliers();
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
			dataIndex: "supplierName",
			sorter: ( a, b ) => a.supplierName > b.supplierName,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Contact",
			dataIndex: "contact",
			sorter: ( a, b ) => a.contact > b.contact,
			sortDirections: [ "descend", "ascend" ],

		},
		{
			title: "Email",
			dataIndex: "email",
			sorter: ( a, b ) => a.email > b.email,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Location",
			dataIndex: "location",
			sorter: ( a, b ) => a.location - b.location,
			sortDirections: [ "descend", "ascend" ],
		},

		{
			title: "Action",
			render: ( text, record, index ) => (
				<Space>
					<Button
						onClick={ () =>
							showModal(
								`Supplier Details`,
								<SupplierDetail data={ record } />,
								"md-lg"
							)
						}
						title="edit record"
						className="d-flex align-items-center">
						<FolderOpenOutlined />
						{/* Edit */ }
					</Button>
					<>
						{ getRole() === ( "admin" || "manager" ) && (
							<Button
								onClick={ () =>
									showModal(
										`Editing Supplier`,
										<SupplierEdit data={ record } onReload={ fetchSuppliers } />
									)
								}
								title="edit record"
								className="d-flex align-items-center">
								<EditOutlined />
								{/* Edit */ }
							</Button>
						) }
						{
							getRole() === "admin" &&
							<Button
								title="delete record"
								onClick={ () => deleteSupplier( record.id ) }>
								<DeleteOutlined className="text-danger" />
							</Button>
						}
					</>
				</Space>
			),
		},
	];

	return (
		<div className="content-container">
			<PageTitle title="Suppliers" />

			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				onCancel={ handleCancel }
				footer={ null }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>

			<div className="bg-white shadow-sm p-3">
				<div className="d-flex align-items-center justify-content-between my-4">
					<PageHeader
						ghost={ false }
						title="Suppliers"
						className="site-page-header"
						onBack={ () => window.history.go( -1 ) }
						subTitle="list of all suppliers engaged in business with company"></PageHeader>
					{ getRole() === ( "admin" || "manager" ) && (
						<Button
							type="primary"
							size="large"
							className="d-flex align-items-center "
							onClick={ () => showModal( "New Supplier", <SupplierForm onReload={ fetchSuppliers } /> ) }>
							<PlusOutlined />
							New Supplier
						</Button> ) }
				</div>
				<div className="row">
					<div className="col-12">
						<Table
							onRow={ ( record, rowIndex ) =>
							{
								return {
									onClick: ( event ) => { },
								};
							} }
							rowKey={ ( record ) => record.id }
							dataSource={ suppliers }
							columns={ columns }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export { SuppliersPage };
