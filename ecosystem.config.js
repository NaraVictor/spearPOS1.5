module.exports = {
	apps: [
		{
			name: "client",
			script: "serve",
			watch: true, //automatically reload app on files change
			env: {
				PM2_SERVE_PATH: "frontend", //error if path and app names are same
				PM2_SERVE_PORT: 1800,
				PM2_SERVE_SPA: "true",
				PM2_SERVE_HOMEPAGE: "/index.html",
			},
		},
		{
			name: "api",
			cwd: "api/",
			script: "index.js",
			// args: "1989",
			watch: true, //automatically reload app on files change
			// exp_backoff_restart_delay: 100, //increases the restart delay time exponentially
			// pm2 restarts the app automatically

			// shortening to just env: makes it the default environment
			env: {
				PORT: 1531,
				NODE_ENV: "production",
			},
			// env_production: {
			// 	PORT: 80,
			// 	NODE_ENV: "production",
			// },
			env_development: {
				PORT: 1531,
				NODE_ENV: "development",
			},
		},
	],
};
