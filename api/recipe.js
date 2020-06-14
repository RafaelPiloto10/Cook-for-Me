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

function get_recipe_by_id(cache, id) {
	return cache["" + id];
}

function similarity_score(recipe, ingredients) {
	return (
		recipe["ingredients"].filter((ingredient) =>
			ingredients.includes(ingredient)
		).length / recipe["ingredients"].length
	);
}

function get_recipes_by_ingredients(
	cache,
	ingredients,
	common_ingredients,
	similarity_threshold
) {
	return new Promise((resolve, reject) => {
		let possible_recipes = [];
		let match_recipes = [];
		cache.forEach((recipe, index, recipes) => {
			let score = similarity_score(recipe, ingredients);
			if (score == 1) {
				match_recipes.push(recipe);
			} else if (score >= similarity_threshold) {
				possible_recipes.push(recipe);
			}
		});
		if (possible_recipes.length < 1 && match_recipes.length < 1)
			reject(
				"Did not find any recipes with the ingredients: " +
					ingredients.toString()
			);
		resolve({
			match: match_recipes,
			suggested: possible_recipes,
		});
	});
}

module.exports = {
	load_recipes,
	load_common_ingredients,
	load_unique_ingredients,
	get_recipe_by_id,
	get_recipes_by_ingredients,
};
