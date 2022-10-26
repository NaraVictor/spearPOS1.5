const ActionArea = (props) => {
	return (
		<div className={`action-area ${props.className}`}>{props.children}</div>
	);
};

export default ActionArea;
