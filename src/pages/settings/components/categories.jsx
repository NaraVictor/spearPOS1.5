import { useState, useEffect } from "react";
import { fetchData, deleteData } from "../../../helpers/api";
import NewCategory from "./new-category";
// import NewSubCategory from "./new-sub-category";
import { Modal, Button, Table, Space } from "antd";
import
{
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import EditCategory from "./edit-category";
import { getRole } from "../../../helpers/auth";
import smalltalk from 'smalltalk'
import { openNotification } from "../../../helpers/utilities";

const CategoriesComponent = ( props ) =>
{
	const [ cats, setCats ] = useState( [] );
	// const [ subCats, setSubCats ] = useState( [] );
	// const [ selected, setSelected ] = useState( {} );

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

	const fetchCats = () =>
	{
		fetchData( "categories" ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				setCats( () => res.data.data );
			}
		} );
	};

	const handleDeleteCategories = ( id ) =>
	{
		smalltalk.confirm(
			"Delete Category", "deleting a category cannot be undone. continue?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( ok =>
		{
			deleteData( `categories/${ id }` ).then( res =>
			{
				if ( res.status === 200 )
				{
					fetchCats()
					openNotification( 'success', 'category deleted', 'success' )
				}
			} );
		} ).catch( ex =>
		{
			return false
		} )

	};



	useEffect( () =>
	{
		fetchCats();
	}, [] );

	// sales table
	const columns = [
		{
			title: "Category Name",
			dataIndex: "name",
			sorter: ( a, b ) => a.name > b.name,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Type",
			dataIndex: "type",
			sorter: ( a, b ) => a.type > b.type,
			sortDirections: [ "descend", "ascend" ],
		},
		// {
		// 	title: "Sub Categories",
		// 	sorter: ( a, b ) => a.subCategories.length > b.subCategories.length,
		// 	sortDirections: [ "descend", "ascend" ],
		// 	render: ( text, record, index ) => record.subCategories.length,
		// },
		{
			title: "Action",
			render: ( text, record, index ) => (
				<Space>
					{/* <Button
						title="view record details"
						className="d-flex align-items-center"
						onClick={ () =>
						{
							setSelected( () => record );
							setSubCats( () => record.subCategories );
						} }>
						<FolderOpenTwoTone />
						view
					</Button> */}
					<Button
						title="edit record"
						className="d-flex align-items-center"
						onClick={ () =>
						{
							showModal(
								`Editing ${ record.name }`,
								<EditCategory category={ record } onReload={ fetchCats } />
							);
						} }>
						<EditOutlined />
						{/* Edit */ }
					</Button>
					{ getRole() === "admin" && (
						<Button title="delete record" onClick={ () => handleDeleteCategories( record.id ) }>
							<DeleteOutlined className="text-danger" />
						</Button>
					) }
				</Space>
			),
		},
	];

	return (
		<>
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				onCancel={ handleCancel }
				footer={ null }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<Space>
				<Button
					type="default"
					size="large"
					className="d-flex align-items-center"
					onClick={ () =>
						showModal( "New Category", <NewCategory onDone={ fetchCats } /> )
					}>
					<PlusOutlined />
					Add Category
				</Button>
				{/* <Button
					type="default"
					size="large"
					className="d-flex align-items-center"
					onClick={ () =>
						showModal(
							"New Sub Category",
							<NewSubCategory category={ selected } onDone={ fetchCats } />
						)
					}>
					<PlusOutlined />
					Add Sub Category
				</Button> */}
			</Space>
			<div className="row mt-3">
				<div className="col-8">
					<div className="shadow-sm bg-white p-3">
						<Table dataSource={ cats } columns={ columns }
							rowKey={ ( record ) => record.id }

						/>
					</div>
				</div>
				{/* <div className="col-4">
					<div className="shadow-sm bg-white p-3">
						{ subCats.length === 0 ? (
							<p>No sub categories found. Select another category</p>
						) : (
							<>
								<p>
									selected: <strong>{ selected.name }</strong>
								</p>
								<Table
									columns={ [
										{
											title: "Sub Categories",
											dataIndex: "name",
											sorter: ( a, b ) => a.name > b.name,
											sortDirections: [ "descend", "ascend" ],
										},

										{
											// title: "Action",
											render: ( text, record, index ) => (
												<Button
													title="delete record"
													onClick={ () => handleDeleteSubCat( record.id ) }>
													<DeleteOutlined className="text-danger" />
												</Button>
											),
										},
									] }
									dataSource={ subCats }
								/>
							</>
						) }
					</div>
				</div> */}
			</div>
		</>
	);
};

export default CategoriesComponent;
