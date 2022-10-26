const AppModal = ({
	title,
	open,
	onClose,
	children,
	className,
	containerClass,
}) => {
	return (
		<div
			id="open-modal"
			className={`modal-window ${open && "show-modal"} ${className}`}>
			<div className={`modal-container ${containerClass} `}>
				<div className="d-flex">
					<h3 className="d-inline header">{title}</h3>
					<a href="#" className="modal-close" onClick={() => onClose()}>
						<span className="material-icons">close</span>
						{/* <span className="d-none d-md-inline">Close</span>{" "} */}
					</a>
				</div>
				{children}
			</div>
		</div>
	);
};

export default AppModal;
