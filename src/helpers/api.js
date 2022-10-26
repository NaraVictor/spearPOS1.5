import axios from "axios";
import { getToken } from "./auth";
import { appUrl } from "./utilities";

export const fetchData = async (url = "", auth = false, config) => {
	try {
		if (auth) {
			axios.defaults.headers.common["authorization"] = getToken();
		}
		const res = await axios.get(`${appUrl}/${url}`, config);
		return res;
	} catch (ex) {
		return ex;
	}
};

export const postData = async (url = "", data = {}, auth = true, config) => {
	try {
		if (auth) {
			axios.defaults.headers.common["authorization"] = getToken();
		}
		const res = await axios.post(`${appUrl}/${url}`, data, config);
		return res;
	} catch (ex) {
		return ex;
	}
};

export const updateData = async (url = "", data = {}, auth = true, config) => {
	try {
		if (auth) {
			axios.defaults.headers.common["authorization"] = getToken();
		}
		const res = await axios.put(`${appUrl}/${url}`, data, config);
		return res;
	} catch (ex) {
		return ex;
	}
};

export const deleteData = async (url = "", config, auth = true) => {
	try {
		if (auth) {
			axios.defaults.headers.common["authorization"] = getToken();
		}
		const res = await axios.delete(`${appUrl}/${url}`, config);
		return res;
	} catch (ex) {
		return ex;
	}
};
