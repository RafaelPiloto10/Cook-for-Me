const csv = require("csvtojson");
const express = require("express");
const recipe = require("./api/recipe");

const PORT = process.env.PORT || 3000;

let data;
let common_ingredients;
let all_ingredients;

const app = express();
app.use(express.static("public"));

console.log("Booting server...");
const route = app.listen(PORT, async () => {
	console.log("Server is up and running!");
	data = await recipe.load_recipes();
	common_ingredients = await recipe.load_common_ingredients();
	all_ingredients = await recipe.load_unique_ingredients();
});

app.get("/search", (req, res) => {
	res.status(200).send("/search");
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

app.get("/api/get-recipe/:id", (req, res) => {
	res.json(recipe.get_recipe_by_id(data, req.params.id));
});

app.get("/api/get-recipes/", (req, res) => {
	let ingredients = req.query.ingredients.split(",");
	// TODO: Implement this hippty doopty
	res.json({
		status: 200,
		message: "Not implemented -- try again later",
	});
});