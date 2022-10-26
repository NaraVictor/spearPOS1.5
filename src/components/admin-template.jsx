import AdminTemplateNav from "./template-nav";
import userIcon from "../static/img/user.png";
import logo from "../static/img/logo.png";
import { getUser, logOut } from "../helpers/auth";
import { Divider, Modal } from "antd";

import { LockFilled, PoweroffOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import ChangeUserPassword from "./change-password";
import { useHistory } from "react-router-dom";


//
const AdminTemplate = ( props ) => {
	const history = useHistory()
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


	return (

		<div className="admin-template">
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				onCancel={ handleCancel }
				footer={ null }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<div className="row g-0">
				<div className="col-md-2 col-12">
					<div className="nav-section p-3">
						{/* <div className="d-flex my-3 align-items-center">
							<img src={ logo } alt="" height="30" />
							<div className="ms-2">
								<h6 className="mb-0 pb-0 text-secondary">spearPOS</h6>
								<small className="mt-0 pt-0">retail point of sale</small>
							</div>
						</div> */}


						<AdminTemplateNav />
						{/* <Divider className="my-3" /> */ }
						<div className="d-flex align-items-center p-2 my-4" style={ { backgroundColor: "#ccc", borderRadius: '5px' } }>
							<img src={ userIcon } alt="user icon" height="20" />
							<strong className="ms-3 my-0">{ getUser().username }</strong>
						</div>
						{/* <Divider className="my-3" /> */ }

						{/* <hr className="w-75" /> */ }
						{/* <div className="d-flex align-items-center"> */ }
						<a
							href="#"
							className="d-flex align-items-center mb-2"
							onClick={ () => {
								history.replace( '/login' )
								logOut()
							} }
							title="close out of current session">
							<PoweroffOutlined className="me-2" />
							<strong>Log out</strong>
						</a>
						{/* |
							<a onClick={ toggleFullScreen } className="nav-link">
								<i className="bi bi-arrows-fullscreen me-2"></i>
							</a> */}
						{/* </div> */ }

						<a
							className="d-flex align-items-center"
							onClick={ () =>
								showModal(
									"Change Password",
									<ChangeUserPassword user={ getUser() } />
								)
							}>
							<LockFilled className="me-2" />
							change password
						</a>


					</div>
				</div>
				<div className="col-12 col-md-10">
					{/* <div className="status-bar bg-success p-2">status bar</div> */ }
					<div className="p-4 content">{ props.children }

						<div className="py-3 text-center">
							spearPOS (v1.5.6) <strong>&copy; { new Date().getFullYear() }</strong> Waffle LLC  | +233 (0)50 915 2188
						</div>
					</div>

				</div>
			</div >
		</div >
	);
};



export default AdminTemplate;
