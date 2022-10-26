import PageTitle from "../../components/page-title";
import { useState, useEffect } from "react";
import { cedisLocale, openNotification } from "../../helpers/utilities";
import { format } from "date-fns";
import { PageHeader, Modal, Button, Table, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import ExpenseForm from "./../../components/expense";
import ExpenseEdit from "./../../components/expense-edit";
import { deleteData, fetchData } from "./../../helpers/api";
import { getRole } from "../../helpers/auth";
import smalltalk from 'smalltalk'

const ExpensesPage = ( props ) =>
{
	const [ expenses, setExpenses ] = useState( [] );
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

	const fetchExpenses = () =>
	{
		fetchData( "expenses" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setExpenses( () => res.data.data );
			}
		} );
	};

	const deleteExpense = ( id ) =>
	{
		smalltalk.confirm(
			"Delete Expenditure", "Are you sure of deleting this expense item? Can't be undone!", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `expenses/${ id }` ).then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					openNotification( "success", "expense successfully deleted", 'success' )
					fetchExpenses();
				}
			} );
		} ).catch( ex =>
		{
			return false
		} )
	};

	useEffect( () =>
	{
		fetchExpenses();
	}, [] );

	// expenses table
	const columns = [
		{
			title: "#",
			sorter: ( a, b ) => a.index > b.index,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) => ++index,
		},
		{
			title: "Date Added",
			sorter: ( a, b ) => new Date( a.date ) > new Date( b.date ),
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return format( new Date( record.date ), "EEE MMM d, yy" );
			},
		},
		{
			title: "Date Modified",
			sorter: ( a, b ) => new Date( a.updatedAt ) > new Date( b.updatedAt ),
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return format( new Date( record.updatedAt ), "EEE MMM d, yy" );
			},
		},
		{
			title: "Description",
			dataIndex: "description",
			sorter: ( a, b ) => a.description > b.description,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Amount",
			// dataIndex: "amount",
			sorter: ( a, b ) => a.amount - b.amount,
			sortDirections: [ "descend", "ascend" ],
			render: ( text, record, index ) =>
			{
				return cedisLocale.format( record.amount );
			},
		},
		{
			title: "Category",
			dataIndex: [ "category", "name" ],
			sorter: ( a, b ) => a.category.name.length > b.category.name.length,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Action",
			render: ( text, record, index ) => (
				<Space>
					<Button
						onClick={ () =>
							showModal(
								`Editing Expense`,
								<ExpenseEdit data={ record } onReload={ fetchExpenses } />
							)
						}
						title="edit record"
						className="d-flex align-items-center">
						<EditOutlined />
						{/* Edit */ }
					</Button>
					{
						getRole() === "admin" && <Button
							title="delete record"
							onClick={ () => deleteExpense( record.id ) }>
							<DeleteOutlined className="text-danger" />
						</Button>
					}
				</Space>
			),
		},
	];

	return (
		<div className="content-container">
			<PageTitle title="Expenses" />

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
						title="Expenses"
						className="site-page-header"
						onBack={ () => window.history.go( -1 ) }
						subTitle="view and record company-wide expenses"></PageHeader>
					<Button
						type="primary"
						size="large"
						className="d-flex align-items-center "
						onClick={ () => showModal( "New Expense", <ExpenseForm onReload={ fetchExpenses } /> ) }>
						<PlusOutlined />
						New Expense
					</Button>
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
							dataSource={ expenses }
							columns={ columns }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export { ExpensesPage };
