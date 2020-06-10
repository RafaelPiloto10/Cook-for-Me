const csv = require("csvtojson");
const express = require("express");

const PORT = process.env.PORT || 3000;

let data;

const process_data = async () => {
	console.log("Loading recipes...");
	const recipes = await csv().fromFile(
		"./data/311962_783630_bundle_archive/RAW_recipes.csv"
	);
	console.log("Loaded recipes!");
	data = recipes;
};

process_data();

const app = express();
app.use(express.static("public"));

console.log("Booting server...");
const route = app.listen(PORT, () => {
	console.log("Server is up and running!");
});

app.get("/get-recipes", (req, res) => {
	if (data !== undefined) {
		res.json(data["0"]);
	} else {
		res.json({
			status: 404,
			message: "Recipes have not yet loaded - try again later",
		});
	}
});
