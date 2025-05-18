const ingredientRegex = /<[\w]+>/;

exports.isIngredient = function (input) {
    return ingredientRegex.test(input);
};

exports.updateIngredients = async function (areaEntry, ingredients) {
    ingredients.forEach((ingredient) => {
        const index = areaEntry.trigger.ingredients.findIndex((item) => item.name === ingredient.name);
        if (index !== -1) {
            areaEntry.trigger.ingredients[index].value = ingredient.value;
        } else {
            areaEntry.trigger.ingredients.push(ingredient);
        }
    });
};

exports.replacePlaceholdersWithIngredients = function (str, ingredients) {
    return str.replace(/<([^>]+)>/g, (match, placeholder) => {
        const ingredient = ingredients.find((ing) => ing.name === placeholder);
        return ingredient ? ingredient.value : match;
    });
};
