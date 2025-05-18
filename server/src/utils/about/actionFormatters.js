const formatAction = (action) => ({
    name: action.name,
    description: action.description,
    parameters: action.parameters,
});

module.exports = { formatAction };
