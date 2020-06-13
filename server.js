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

app.get("/api/get-recipes/:set", (req, res) => {
	if (data !== undefined) {
		let set = req.params.set || 1;
		let min_range = 25 * set - 25;
		let max_range = 25 * set;
		let recipes = [];
		for (let i = min_range; i < max_range; i++) {
			recipes.push(data["" + i]);
		}
		res.json(recipes);
	} else {
		res.json({
			status: 404,
			message: "Recipes have not yet loaded - try again later",
		});
	}
});
