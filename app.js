const express = require("express");
const app = express();

const PORT = 1338;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/api", require("./api.js"));

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/html/index.html`);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));