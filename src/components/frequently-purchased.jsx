import ProductDetail from "./product-detail";
import { Modal, Table } from "antd";
import { useState } from "react";

const FrequentlyPurchased = ( { prods, onShowModal } ) =>
{
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
	const cols = [
		{
			title: "Name",
			dataIndex: "productName",
			sorter: ( a, b ) => a.productName.length - b.productName.length,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Available Stock",
			dataIndex: "quantity",
			sorter: ( a, b ) => a.quantity - b.quantity,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Unit Price",
			dataIndex: "sellingPrice",
			sorter: ( a, b ) => a.quantity - b.quantity,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "Category",
			dataIndex: [ "category", "name" ],
			sorter: ( a, b ) => a.category.name.length - b.category.name.length,
			sortDirections: [ "descend", "ascend" ],
		},
		{
			title: "# Sold",
			dataIndex: "salesCount",
			sorter: ( a, b ) => a.salesCount - b.salesCount,
			sortDirections: [ "descend", "ascend" ],
		},
	];

	return (
		<>
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				footer={ null }
				onCancel={ handleCancel }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<Table
				rowKey={ ( record ) => record.id }
				onRow={ ( record, rowIndex ) =>
				{
					return {

						onClick: ( event ) =>
						{
							showModal( record.productName, <ProductDetail prod={ record } /> );
						},
					};
				} }
				dataSource={ prods }
				columns={ cols }
			/>
		</>
	);
};

export default FrequentlyPurchased;
