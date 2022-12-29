import { exportToExcel } from "../helpers/utilities";
import { Button } from "antd";
import { FileExcelFilled } from "@ant-design/icons";

const ExportToExcelButton = ( {
	tableId,
	fileName,
	workSheetName,
	btnLabel = "to Excel",
	className = "",
} ) =>
{
	return (
		<Button
			className="d-flex align-items-center"
			onClick={ () => exportToExcel( tableId, fileName, workSheetName ) }>
			<FileExcelFilled />
			{ btnLabel }
		</Button>
	);
};

export default ExportToExcelButton;
