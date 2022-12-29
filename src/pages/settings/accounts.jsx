import PageTitle from "../../components/page-title";
import { useState, useEffect } from "react";
import { fetchData, deleteData, postData } from "../../helpers/api";
import SignUpPage from "../auth/signup";
import { Modal, PageHeader, Button, Table, Space, Alert, Divider } from "antd";
import EditUser from "./user-edit";
import
{
	EditOutlined,
	FileSearchOutlined,
	LockTwoTone,
	StopFilled,
	UnlockOutlined,
	UserAddOutlined,
} from "@ant-design/icons";
import { UserLogs } from "./user-logs";
import { getRole, getUser } from "../../helpers/auth";
import { openNotification } from "../../helpers/utilities";
import smalltalk from 'smalltalk'


const AccountsPage = ( props ) =>
{
	const [ users, setUsers ] = useState( [] );
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

	const handleUpdateStatus = ( userId ) =>
	{
		if ( getRole() !== "admin" )
		{
			openNotification( 'error', "permission denied", 'error' );
			return;
		}

		deleteData( `accounts/${ userId }` ).then( ( res ) =>
		{
			if ( res.status === 200 )
			{
				fetchUsers();
				openNotification( 'success', "request completed successfully", 'success' );
				return;
			}

			openNotification( 'error', "error, request not completed", 'error' );
		} );
	};

	const handlePasswordReset = ( email ) =>
	{
		if ( getRole() !== "admin" )
		{
			openNotification( 'error', "permission denied", 'error' );
			return;
		}

		if ( getUser().email === email )
		{
			openNotification( 'password reset error', "you cannot reset your password. use the 'change password' instead", 'error' );
			return;
		}

		smalltalk.confirm(
			"Password Reset", "This will generate a random password for user. Do you wish to continue?", {
			buttons: {
				ok: 'YES',
				cancel: 'NO',
			},
		}
		).then( go =>
		{

			postData( `accounts/forgot-password`, { email } ).then( ( res ) =>
			{
				if ( res.status === 200 )
				{
					openNotification( 'success', "password reset successful", 'success' );
					showModal(
						"New Password",
						<>
							<h5>Password reset successful. Copy Password below:</h5>
							<Divider />
							<h3 className="text-success">{ res.data.newPassword }</h3>
							<Divider />
							<p>Use the above password to change password for user</p>
						</>
					);
					return;
				}

				openNotification( 'error', "Error! Try activating user and try again.", 'error' );
			} );
		} ).catch( ex =>
		{
			return false
		} )
	};

	const fetchUsers = () =>
	{
		fetchData( "accounts" )
			.then( ( res ) =>
			{
				// console.log(res);
				if ( res.status === 200 )
				{
					setUsers( () => res.data.data.filter( u => u.username.toLowerCase() !== ( "admin" || "superuser" ) ) );
				}
			} )
			.catch( ( ex ) => console.log( ex ) );
	};

	useEffect( () =>
	{
		fetchUsers();
	}, [] );

	return (
		<div className="content-container">
			<PageTitle title="Accounts" />

			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				onCancel={ handleCancel }
				footer={ null }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<div className="row">
				<div className="col-12">
					<div className="d-flex align-items-center justify-content-between my-4">
						<PageHeader
							ghost={ false }
							title="Accounts"
							className="site-page-header"
							onBack={ () => window.history.go( -1 ) }
							subTitle="user accounts information"></PageHeader>
						{ getRole() === "admin" && (
							<Button
								type="primary"
								size="large"
								onClick={ () =>
									showModal(
										"Create Account",
										<SignUpPage onDone={ fetchUsers } />
									)
								}
								className="d-flex align-items-center ">
								<UserAddOutlined />
								Add User
							</Button>
						) }
					</div>
				</div>
			</div>

			<div className="row mt-3">
				<div className="col-12">
					<div className="shadow-sm bg-white p-3">
						<Table
							columns={ [
								{
									title: "Staff",
									render: ( text, record, index ) =>
										`${ record.staff.firstName } ${ record.staff.lastName }`,
								},
								{
									title: "Username",
									dataIndex: "username",
								},
								{
									title: "Email",
									dataIndex: "email",
								},
								{
									title: "Role",
									dataIndex: "role",
								},
								{
									title: "Status",
									render: ( t, r, i ) =>
									{
										return r.isDeleted ? (
											<Alert message="inactive" type="error" showIcon />
										) : (
											<Alert message="active" type="success" showIcon />
										);
									},
								},
								{
									title: "Tasks",
									render: ( text, record, index ) => (
										<Space>
											<Button
												title="edit user"
												className="d-flex align-items-center"
												onClick={ () =>
												{
													if ( getRole() !== "admin" )
													{
														openNotification( 'error', "permission denied", 'error' );
														return;
													}
													showModal(
														"Editing " + record.username,
														<EditUser user={ record } onReload={ fetchUsers } />
													);
												} }>
												<EditOutlined />
											</Button>
											<Button
												title="view user activity logs"
												className="d-flex align-items-center"
												onClick={ () =>
												{
													showModal(
														record.username + "'s Logs",
														<UserLogs userId={ record.id } />,
														"500px"
													);
												} }>
												<FileSearchOutlined />
												logs
											</Button>
											<Button
												title="update password"
												className="d-flex align-items-center"
												onClick={ () => handlePasswordReset( record.email ) }>
												<LockTwoTone />
												reset password
											</Button>

											{/* <DeleteOutlined className="text-danger" /> */ }
											{ record.isDeleted ? (
												<Button
													title="activate user account"
													className="d-flex align-items-center"
													onClick={ () => handleUpdateStatus( record.id ) }>
													<UnlockOutlined className="text-success" />
													activate
												</Button>
											) : (
												<Button
													className="d-flex align-items-center"
													title="disable/de-activate user account"
													onClick={ () => handleUpdateStatus( record.id ) }>
													<StopFilled className="text-danger" />
													disable
												</Button>
											) }
										</Space>
									),
								},
							] }
							dataSource={ users }
							rowKey={ ( record ) => record.id }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export { AccountsPage };
