const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");

async function load_recipes() {
	console.log("Loading recipes...");
	const recipes = await csv().fromFile(
		"./data/311962_783630_bundle_archive/RAW_recipes.csv"
	);
	console.log("Loaded recipes!");
	return recipes;
}

function load_common_ingredients() {
	return new Promise((resolve, reject) => {
		console.log("Loading common ingredients..");
		fs.readFile(
			path.resolve(__dirname, "../data/common_ingredients.txt"),
			(err, data) => {
				if (err) reject(err);
				resolve(data.toString().split(","));
				console.log("Done loading common ingredients.");
			}
		);
	});
}

async function load_unique_ingredients() {
	return new Promise((resolve, reject) => {
		console.log("Loading all ingredients");
		fs.readFile(
			path.resolve(__dirname, "../data/all_ingredients.txt"),
			(err, data) => {
				if (err) reject(err);
				resolve(data.toString().split(","));
				console.log("Loaded all ingredients.");
			}
		);
	});
}

module.exports = {
	load_recipes,
	load_common_ingredients,
	load_unique_ingredients,
};
