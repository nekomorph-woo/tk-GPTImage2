import fs from "node:fs";

const recipes = JSON.parse(fs.readFileSync("recipes/recipes.json", "utf8"));

for (const recipe of recipes) {
  console.log(`${recipe.id}: ${recipe.name}`);
  console.log(`  ${recipe.use_when}`);
}
