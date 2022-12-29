import PageTitle from "../../components/page-title";
import { useState, useEffect } from "react";
import { PageHeader, Modal, Button, Table, Space } from "antd";
import { DeleteOutlined, EditOutlined, FolderOpenOutlined, PlusOutlined } from "@ant-design/icons";
import CustomerForm from "../../components/customer";
import CustomerEdit from "../../components/customer-edit";
import { deleteData, fetchData } from "../../helpers/api";
import CustomerDetail from "../../components/customer-detail";
import { getRole } from "../../helpers/auth";
import smalltalk from 'smalltalk'
import { openNotification } from "../../helpers/utilities";

const CustomersPage = ( props ) =>
{
	const [ customers, setCustomers ] = useState( [] );
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

	const fetchCustomers = () =>
	{
		fetchData( "customers" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setCustomers( () => res.data.data );
			}
		} );
	};

	const deleteCustomer = ( id ) =>
	{

		smalltalk.confirm(
			"Delete Customer", "Are you sure of deleting this customer? Can't be undone!", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `customers/${ id }` ).then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					openNotification( "success", "customer successfully deleted", 'success' )
					fetchCustomers();
				}
			} );
		} ).catch( ex =>
		{
			openNotification( "error", "error deleting customer", 'error' )
			return false
		} )
	};

	useEffect( () =>
	{
		fetchCustomers();
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
			dataIndex: "name",
			sorter: ( a, b ) => a.name > b.name,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Contact",
			dataIndex: "primaryContact",
			sorter: ( a, b ) => a.primaryContact > b.primaryContact,
			sortDirections: [ "descend", "ascend" ],

		},
		{
			title: "Category",
			dataIndex: "category",
			sorter: ( a, b ) => a.category > b.category,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Address",
			dataIndex: "address",
			sorter: ( a, b ) => a.address - b.address,
			sortDirections: [ "descend", "ascend" ],
		},

		{
			title: "Action",
			render: ( text, record, index ) => (
				<Space>
					<Button
						onClick={ () =>
							showModal(
								`Customer Detail`,
								<CustomerDetail data={ record } />,
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
										`Editing Customer`,
										<CustomerEdit data={ record } onReload={ fetchCustomers } />
									)
								}
								title="edit record"
								className="d-flex align-items-center">
								<EditOutlined />
								{/* Edit */ }
							</Button>
						) }
						{
							getRole() === "admin" && <Button
								title="delete record"
								onClick={ () => deleteCustomer( record.id ) }>
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
			<PageTitle title="Customers" />

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
						title="Customers"
						className="site-page-header"
						onBack={ () => window.history.go( -1 ) }
						subTitle="list of all customers engaged in business with company"></PageHeader>
					{ getRole() === ( "admin" || "manager" ) && (
						<Button
							type="primary"
							size="large"
							className="d-flex align-items-center "
							onClick={ () => showModal( "New Customer", <CustomerForm onReload={ fetchCustomers } /> ) }>
							<PlusOutlined />
							New Customer
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
							dataSource={ customers }
							columns={ columns }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export { CustomersPage };
