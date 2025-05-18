class Trigger {
  final String name;
  final String description;
  final List<Map<String, String>> parameters;
  final List<Map<String, String>> ingredients;

  Trigger({
    required this.name,
    required this.description,
    required this.parameters,
    required this.ingredients,
  });

  factory Trigger.fromJson(Map<String, dynamic> json) {
    List<Map<String, String>> paramsList = (json['parameters'] as List).map((item) {
      return {
        'name': item['name'] as String,
        'input': item['input'] as String,
      };
    }).toList();

    List<Map<String, String>> ingredientsList = (json['ingredients'] as List).map((item) {
      return {
        'name': item['name'] as String,
        'description': item['description'] as String,
      };
    }).toList();

    return Trigger(
      name: json['name'],
      description: json['description'],
      parameters: paramsList,
      ingredients: ingredientsList,
    );
  }
}
