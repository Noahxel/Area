const formatTrigger = (trigger) => ({
    name: trigger.name,
    description: trigger.description,
    parameters: trigger.parameters,
    ingredients: trigger.ingredients || [],
});

module.exports = { formatTrigger };
