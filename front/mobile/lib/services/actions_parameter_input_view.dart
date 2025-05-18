import 'package:flutter/material.dart';
import './action.dart' as MyAction;
import './service.dart';
import '../components/area_creation_state.dart';
import 'package:provider/provider.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'connect_service_view.dart';
import 'dart:ui';

Future<String?> fetchServiceColor(String serviceName) async {
  const String url = 'https://api.techparisarea.com/about.json';
  SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');

  if (token == null) {
    throw Exception('No token found');
  }

  final response = await http.get(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    final services = data['server']['services'] as List;

    for (var service in services) {
      if (service['name'] == serviceName) {
        return service['color'];
      }
    }

    throw Exception('Service not found');
  } else {
    throw Exception('Failed to load services');
  }
}

String formatActionParameter(String original) {
  return original
      .split('_')
      .map((str) => '${str[0].toUpperCase()}${str.substring(1)}')
      .join(' ');
}

class ActionParameterInputPage extends StatefulWidget {
  final Service actionService;
  final MyAction.Action action;
  final List<Map<String, String>> ingredients;

  ActionParameterInputPage({
    required this.actionService,
    required this.action,
    required this.ingredients,
  });

  @override
  ActionParameterInputPageState createState() =>
      ActionParameterInputPageState();
}

class ActionParameterInputPageState extends State<ActionParameterInputPage> {
  late final List<TextEditingController> _controllers;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(
        widget.action.parameters.length, (index) => TextEditingController());
  }

  @override
  Widget build(BuildContext context) {
    Color backgroundColor =
        Color(int.parse('0xFF${widget.actionService.color.substring(1)}'));
    String logoAssetName =
        'assets/servicesLogo/${widget.actionService.name}.png';
    final areaState = Provider.of<AreaCreationState>(context, listen: false);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: ListView(
        children: [
          Container(
            color: backgroundColor,
            width: double.infinity,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                children: [
                  const SizedBox(height: 55),
                  const Text(
                    'Input Parameters',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Archivo',
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 50),
                  Image.asset(logoAssetName, height: 64, width: 64),
                  const SizedBox(height: 70),
                ],
              ),
            ),
          ),
          ...List.generate(widget.action.parameters.length, (index) {
                  final parameter = widget.action.parameters[index];
                  return Padding(
                    padding: const EdgeInsets.fromLTRB(40.0, 10.0, 40.0, 15.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          formatActionParameter(parameter['name']!),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            fontFamily: 'Archivo',
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _controllers[index],
                          style: const TextStyle(
                              color: Colors.white, fontWeight: FontWeight.w500),
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: const Color(0xFF1D1D1D),
                            hintText: parameter['input'],
                            labelStyle: const TextStyle(
                                color: Colors.white, fontFamily: 'Archivo'),
                            hintStyle: const TextStyle(
                                color: Colors.white54, fontFamily: 'Archivo'),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8.0),
                              borderSide: BorderSide.none,
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8.0),
                              borderSide:
                                  const BorderSide(color: Colors.white54),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        ElevatedButton(
                          child: const Text(
                            "Add ingredient",
                            style: const TextStyle(
                                color: Colors.black,
                                fontWeight: FontWeight.w800,
                                fontSize: 18,
                                fontFamily: 'Archivo'),
                          ),
                          onPressed: () async {
                            String? triggerServiceColor =
                                await fetchServiceColor(
                                    areaState.trigger['service']);
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              builder: (BuildContext context) {
                                return BackdropFilter(
                                  filter:
                                      ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                                  child: FractionallySizedBox(
                                    heightFactor: 0.6,
                                    alignment: Alignment.bottomCenter,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                      ),
                                      child: Drawer(
                                        child: MediaQuery.removePadding(
                                          context: context,
                                          removeLeft: true,
                                          child: Column(
                                            children: [
                                              Container(
                                                width: MediaQuery.of(context)
                                                    .size
                                                    .width,
                                                color: Color(int.parse(
                                                    '0xFF${triggerServiceColor!.substring(1)}')),
                                                child: Column(
                                                  children: [
                                                    SizedBox(height: 20),
                                                    Image.asset(
                                                      'assets/servicesLogo/${areaState.trigger['service']}.png',
                                                      height: 64,
                                                      width: 64,
                                                    ),
                                                    SizedBox(height: 10),
                                                    Text(
                                                      capitalize(areaState
                                                          .trigger['service']),
                                                      style: TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 24,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        fontFamily: 'Archivo',
                                                      ),
                                                    ),
                                                    const SizedBox(height: 20),
                                                  ],
                                                ),
                                              ),
                                              const SizedBox(height: 20),
                                              Expanded(
                                                child: ListView.builder(
                                                  itemCount:
                                                      widget.ingredients.length,
                                                  itemBuilder: (context,
                                                      ingredientIndex) {
                                                    final ingredient =
                                                        widget.ingredients[
                                                            ingredientIndex];
                                                    return Padding(
                                                      padding: const EdgeInsets
                                                          .symmetric(
                                                          vertical: 5.0),
                                                      child: ListTile(
                                                        title: Container(
                                                          padding:
                                                              EdgeInsets.all(
                                                                  12.0),
                                                          decoration:
                                                              BoxDecoration(
                                                            color: Color(int.parse(
                                                                '0xFF${triggerServiceColor!.substring(1)}')), // Using the triggerServiceColor
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        8.0), // Rounded corners
                                                          ),
                                                          child: Text(
                                                            ingredient[
                                                                'description']!,
                                                            style: TextStyle(
                                                                color: Colors
                                                                    .white,
                                                                fontFamily:
                                                                    'Archivo',
                                                                fontSize: 18,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .w600),
                                                          ),
                                                        ),
                                                        onTap: () {
                                                          _controllers[index]
                                                                  .text =
                                                              '${_controllers[index].text}<${ingredient['name']}>';
                                                          Navigator.pop(
                                                              context);
                                                        },
                                                      ),
                                                    );
                                                  },
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            primary: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(7),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),

          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
            child: ElevatedButton(
              onPressed: () {
                final parameters =
                    widget.action.parameters.asMap().entries.map((entry) {
                  int idx = entry.key;
                  var param = entry.value;
                  return {
                    'name': param['name'],
                    'input': _controllers[idx].text.isEmpty
                        ? ""
                        : _controllers[idx].text
                  };
                }).toList();

                areaState.addAction({
                  'service': widget.actionService.name,
                  'name': widget.action.name,
                  'parameters': parameters,
                });

                Navigator.popUntil(context, (route) => route.isFirst);
              },
              style: ElevatedButton.styleFrom(
                primary: Colors.white,
                onPrimary: Color(0xFF1D1D1D),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16.0),
                ),
                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 16.0),
              ),
              child: Text("Add", style: TextStyle(fontSize: 18, fontFamily: 'Archivo', fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }

  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }
}
