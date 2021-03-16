const express = require("express");
const RandExp = require("randexp");
const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const rateLimiting = require("express-rate-limit");
const apicache =  require("apicache");
const route = express.Router();

route.use(rateLimiting({
	windowMs: 30000,
	max: 20,
	statusCode: 200,
	message: "Too many requests, please wait."
}));

const authProvider = new ClientCredentialsAuthProvider(require("./conf.js").twitch, require("./conf.js").twitch2);
const apiClient = new ApiClient({ authProvider });

route.get("/random/:len?/:amnt?", (req, res) => {
	const params = req.params;
	
	var name = gen(params.len, params.amnt);

	res.send(name);
});

route.get("/exists/:username?", apicache.middleware("30 minutes"), async (req, res) => {
	const params = req.params;

	if(params.username) {
		const user = await apiClient.helix.users.getUserByName(params.username.toLowerCase());
		res.send(user !== null);
	}
});

function gen(len=4, amnt=1) {
	if(len > 16) len = 16;
	if(parseInt(amnt) > 1) {
		const names = [];
		for (var i = 0; i < parseInt(amnt); i++) {
			var name = new RandExp("^[a-zA-Z0-9][\\w]{"+(parseInt(len)-1)+"}$").gen();
			names.push(name);

			if(i === parseInt(amnt)-1 || i === 249) {
				break;
			}
		}

		return names.sort().join("\n");
	} else {
		var name = new RandExp("^[a-zA-Z0-9][\\w]{"+(parseInt(len)-1)+"}$").gen();
		return name;
	}
}

module.exports = route;