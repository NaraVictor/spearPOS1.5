const receiptNumberGenerator = (num = 0, abbrs = "SKE") => {
	let receipt = "";

	const digit = num.toString();

	// if (digit.length === 1) receipt = `${abbrs}000${num}`;

	switch (digit.length) {
		case 1:
			receipt = `${abbrs}000${num}`;
			break;

		case 2:
			receipt = `${abbrs}00${num}`;
			break;

		case 3:
			receipt = `${abbrs}0${num}`;
			break;

		default:
			receipt = `${abbrs}${num}`;
			break;
	}

	return receipt;
};

const mailer = {
	senders: {
		homecoming: "Homecoming <homecoming@vfghf.org>",
		noReply: "Activity - Monitoring - Reporting <no-reply@vfghf.org>",
	},
	users: {
		homecoming: "homecoming@vfghf.org",
		defaultUser: "no-reply@vfghf.org",
	},
	password: {
		defaultPwd: "covid2019.",
	},
	subjects: {
		homecomingAccountCreation: "Homecoming Account Creation",
		accountCreation: "Account Creation",
		passwordReset: "Password Reset",
		passwordChange: "Password Change",
	},
	messages: {
		homecomingAccount: (fullName) => {
			return `<p>Hi <strong>${fullName},</strong> your homecoming account has been successfully created</p>`;
		},
		passwordReset: (newPwd) => {
			return `<p>Hi, you recently requested a password reset</p>
                <p>Use <h3><strong>${newPwd}</strong></h3> as your new password</p> 
                <p>Kindly change this automatically generated password immediately</p>`;
		},
		passwordChanged: () => {
			return `<p>Nice! your password has been successfully changed.</p>`;
		},
		accountCreation: (name) => {
			return `<p>Dear <strong>${name}</strong>, your account has been successfully created.</p>`;
		},
	},
};

module.exports = { receiptNumberGenerator, mailer };
