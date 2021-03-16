const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = 80;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use("/api", require("./api.js"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/html/index.html`);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));