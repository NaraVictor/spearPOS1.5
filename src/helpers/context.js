import React, { useState } from "react";

export const UserContext = React.createContext({});

const CurrentUserContext = (props) => {
	const [user, setUser] = useState({});
	const updateUser = (data) => {
		setUser(() => data);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				updateUser,
			}}>
			{props.children}
		</UserContext.Provider>
	);
};

export default CurrentUserContext;
