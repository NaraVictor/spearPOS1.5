import { decryptString, encryptString, toggleRegisterState } from "./utilities";
import {
	roleEncryptionKey,
	tokenEncryptionKey,
	userEncryptionKey,
} from "./config";
import _ from "lodash";

const authenticate = (token, user) => {
	const eToken = encryptString(token, tokenEncryptionKey);
	const eUser = encryptString(JSON.stringify(user), userEncryptionKey);

	sessionStorage.setItem("spTK", eToken); //spTK -> spearToken
	sessionStorage.setItem("spUsr", eUser); //spUsr -> spearUser
};

const getToken = () => {
	return decryptString(sessionStorage.getItem("spTK"), tokenEncryptionKey);
};

const getUser = () => {
	const user = sessionStorage.getItem("spUsr");
	if (!user) return;
	// const userObj = JSON.parse(decryptString(user, userEncryptionKey));

	return JSON.parse(decryptString(user, userEncryptionKey));
};

const logOut = () => {
	sessionStorage.removeItem("spTK");
	sessionStorage.removeItem("spUsr");
	removeRole();
	toggleRegisterState();
};

const isAuthenticated = () => {
	const token = sessionStorage.getItem("spTK");
	return token ? true : false;
};

const setRole = (role) => {
	const r = encryptString(role, roleEncryptionKey);
	sessionStorage.setItem("spRl", r);
	// spRl - spearRole
};

const removeRole = () => {
	sessionStorage.removeItem("spRl");
};

const getRole = () => {
	const r = sessionStorage.getItem("spRl");
	return decryptString(r, roleEncryptionKey);
};

const isAdmin = (userId) => {
	return getUser().id === userId;
};

export {
	authenticate,
	isAuthenticated,
	getToken,
	logOut,
	setRole,
	getRole,
	removeRole,
	getUser,
	isAdmin,
};
