module.exports = {
	apps: [
		{
			name: "api",
			// cwd: "api/",
			script: "index.js",
			watch: true, //automatically reload app on files change
			env: {
				PORT: 1531,
				NODE_ENV: "production",
				// application
				JWT_KEY: "U2FsdGVkX19+DyOBP6Ai5fwGcqJ+dqQ8fGCt8LqV/KNBO8RAAuGwawjgDF1Vs/Gx",
				DB_USER: "U2FsdGVkX1/RnmSiZ3d0QhWQJT5ecKgTDWBHDV2NhWs=",
				DB_PASSWORD: "U2FsdGVkX18daqhSFcIm9uQv2qlQwC5icWDkDb3Fugs=",
				DB_NAME: "U2FsdGVkX19Rzb1Ce4hcisl/5e/FL9ENZG4QNQpZzYI=",
			},
		},
	],
};
