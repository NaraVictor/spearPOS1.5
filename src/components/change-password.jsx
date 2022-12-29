import { Button } from "antd";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { postData } from "./../helpers/api";
import { logOut } from "../helpers/auth";
import { openNotification } from "../helpers/utilities";

const ChangeUserPassword = ( { user } ) =>
{
	const [ busy, setBusy ] = useState( false );
	const { handleSubmit, register, reset } = useForm();

	const onUpdatePassword = ( data ) =>
	{
		setBusy( true );

		if ( data.newPassword === data.currentPassword )
		{
			openNotification( "Error", "both new and old passwords are the same!", "error" )
			setBusy( false );
			return;
		}

		postData( "accounts/change-password", { ...data, userId: user.id } ).then(
			( res ) =>
			{
				if ( res.status === 200 )
				{
					reset();
					openNotification( "success", "password change successful. logging you out!", "success" )
					setTimeout( () =>
					{
						logOut();
						setBusy( false );
						window.location.reload();
					}, 5000 )
					return;
				}

				setBusy( false );
				openNotification( "Error", "Error, password change unsuccessful.", "error" )
			}
		);
	};

	return (
		<>
			<p>
				You are about to change password for user:
				<strong className="ms-2">{ user.username }</strong>
			</p>

			<form onSubmit={ handleSubmit( onUpdatePassword ) }>
				<div className="row">
					<div className="col-12">
						<label htmlFor="cPwd">Current Password</label>
						<input
							type="password"
							className="w-100 form-control"
							autoFocus
							placeholder="enter current password"
							id="cPwd"
							{ ...register( "currentPassword", { required: true } ) }
						/>
					</div>
					<div className="col-12 my-3">
						<label htmlFor="newpwd">New Password</label>
						<input
							type="password"
							className="w-100 form-control"
							placeholder="enter new password"
							id="newpwd"
							{ ...register( "newPassword", { required: true } ) }
						/>
					</div>
				</div>
				<input type="submit" hidden id="submitter" />
			</form>
			<Button
				loading={ busy ? true : false }
				type="primary"
				size="large"
				onClick={ () => document.getElementById( "submitter" ).click() }>
				{ busy ? "updating..." : "Update Password" }
			</Button>
		</>
	);
};

export default ChangeUserPassword;
