import csv
from collections import Counter

ingredients = []

print('Loading recipe database...')
with open('311962_783630_bundle_archive/RAW_recipes.csv', newline='') as csvfile:
    data = csv.DictReader(csvfile)
    print('Loaded recipe database!')
    for row in data:
        for ingredient in row['ingredients'].strip('][').split(', '):
            ingredients.append(ingredient[1:-1])
    print("Done collecting ingredients")

MAX = 100
print("Finding most common ingredients.")
most_common = [Counter(ingredients).most_common(MAX)[i][0] for i in range(MAX)]
print("Done.")

common_ingredients_file = open("common_ingredients.txt", "w")
print("Writing common ingredients to file")
common_ingredients_file.write(",".join(most_common))
print("Done.")

