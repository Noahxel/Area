class Action {
  final String name;
  final String description;
  final List<Map<String, String>> parameters;

  Action({
    required this.name,
    required this.description,
    required this.parameters,
  });

  factory Action.fromJson(Map<String, dynamic> json) {
    List<Map<String, String>> paramsList = (json['parameters'] as List).map((item) {
      return {
        'name': item['name'] as String,
        'input': item['input'] as String,
      };
    }).toList();

    return Action(
      name: json['name'],
      description: json['description'],
      parameters: paramsList,
    );
  }
}
