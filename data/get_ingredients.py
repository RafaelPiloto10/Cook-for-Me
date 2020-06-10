import csv

ingredients = []

print('Loading recipe database...')
with open('311962_783630_bundle_archive/RAW_recipes.csv', newline='') as csvfile:
    data = csv.DictReader(csvfile)
    print('Loaded recipe database!')
    for row in data:
        for ingredient in row['ingredients'].strip('][').split(', '):
            if ingredient not in ingredients:
                ingredients.append(ingredient)

print('Saving ingredients...')
ingredients_file = open('all_ingredients.txt', 'w')
ingredients_file.write(', '.join(sorted(ingredients)))
print(f"Done. Saved a total of {len(ingredients)} ingredients.")
